from flask import Flask, request, jsonify
import os
import json
from datetime import datetime
import threading
import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from receiver import start_recording
from globals import stop_event


app = Flask(__name__)

recording_thread = None

directory = "../documents"

def getMaxId():

    id_1 = 0
    id_2 = 0
    id_3 = 0

    max_alphabetic_weight = ""
    for filename in os.listdir(directory):
        if filename.endswith(".json"):
            try:
                if filename > max_alphabetic_weight:
                    max_alphabetic_weight = filename
            except ValueError:
                continue
    
    if max_alphabetic_weight != "":

        patient_idPart = max_alphabetic_weight.split(".json")[0].split("_")[-1] #  XXX-XX-XXXX
        patient_id = patient_idPart.split("-")
        id_1, id_2, id_3 = map(int, patient_id)
        
        if id_3 < 9999:
            id_3 += 1
        elif id_2 < 99:
            id_2 += 1
            id_3 = 0
        elif id_1 < 999:
            id_1 += 1
            id_2 = id_3 = 0

    return f"{id_1}-{id_2}-{id_3}"
    


@app.route("/documents", methods=["GET"])
def findDocuments():
    all_data = []

    for filename in os.listdir(directory):
        if filename.endswith(".json"):
            filepath = os.path.join(directory, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                try:
                    data = json.load(f)
                    all_data.append(data)
                except json.JSONDecodeError as e:
                    print(f"❌ Error decoding {filename}: {e}")
    
    return jsonify(all_data), 200

@app.route("/analytics/<patientId>", methods=["GET"])
def getAnalytics(patientId):
    print(patientId)
    for filename in os.listdir(directory):
        if filename.endswith(patientId + ".json"):
            filepath = os.path.join(directory, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                try:
                    data = json.load(f)
                    print(data)
                    return jsonify(data), 200
                except json.JSONDecodeError as e:
                    print(f"❌ Error decoding {filename}: {e}")
                    return jsonify({"error": "Invalid JSON"}), 400

    return jsonify({"error": "File not found"}), 404

@app.route("/register", methods=["POST"])
def registerPatient():
    patient_data = request.json
    newPatient_ID = getMaxId()

    filepath = os.path.join(directory, f"patient_{newPatient_ID}.json")
    
    try:

        data_record = {
            "PatientID":  newPatient_ID,
            "PatientName": f"{str(patient_data['name']).upper()} {str(patient_data['surname']).upper()}",
            "DateOfBirth": str(datetime.fromisoformat(patient_data["birthDate"])),
            "Sex": "Female" if patient_data["sex"] == "female" else "Male"
        }


        with open(filepath, "w", encoding="utf-8") as f:
            json.dump({"PatientInfo": data_record, "Records": []}, f, indent=4)
        return jsonify({"message": f"Patient n°{newPatient_ID} registered successfully"}), 201
    except Exception as e:
        print(f"❌ Error writing file {filepath}: {e}")
        return jsonify({"error": "Failed to register patient"}), 500

@app.route("/recording/<patientID>", methods=["GET"])
def recording(patientID):
    #if recording_thread is not None:
    #    return jsonify({"error": "Recording is already running"}), 400
    
    filename = f"patient_{patientID}.json"
    threading.Thread(target=start_recording, args=(filename,), daemon=True).start()
    return jsonify({"message": "Recording started"}), 200

@app.route("/recording/stop", methods=["GET"])
def stop_recording():
    stop_event.set()
    return jsonify({"message": "Recording ended"}), 200

if __name__ == "__main__":
    app.run(debug=True) 