import socket
import sys
import hl7
import keyboard
import os
import json
from datetime import datetime
    
def parse_hl7_message(hl7_message):
    try:
        h = hl7.parse(message)
        return h
    except Exception as e:
        raise ValueError(f"Failed to parse HL7 message: {e}")

def HL7InformationMapping(choice, message):
    mapping = {
        '1': 'PID',
        '2': 'OBR',
        '3': 'OBX',
    }

    if choice in mapping:

        if mapping[choice] == 'PID':
            showPIDInformation(message)
        elif mapping[choice] == 'OBR':
            showOBRInformation(message)
        elif mapping[choice] == 'OBX':
            showOBXInformation(message)
    elif choice == '4':
        print("Quitter le programme.")
        sys.exit(0)
    else:
        print("Choix invalide. Veuillez réessayer.")
    
def showPIDInformation(message):
    """ Affiche les informations du segment PID """
    print("\n ------------------------------------------\n")
    print("PID's Informations : \n")
    print("Patient name : ",  message['PID'][0][5][0][1], message['PID'][0][5][0][0], "\n")
    print("Patient ID : ", message['PID'][0][3][0], "\n")
    print("Date of birth : ", datetime.fromtimestamp(int(message['PID'][0][7][0])) , "\n")
    print("Sex : ", "Female" if message['PID'][0][8][0] == "F" else "Male", "\n")
    print("Patient address : ", message['PID'][0][11][0][0], ",", message['PID'][0][11][0][4], message['PID'][0][11][0][2], ",", message['PID'][0][11][0][3], "\n")
    print("Phone number : ", message['PID'][0][13][0])
    print("\n ------------------------------------------\n")

def showOBRInformation(message):
    """ Affiche les informations du segment OBR """
    print("\n ------------------------------------------\n")
    print("OBR's Informations : \n")
    print("Beginning of observation : ", datetime.fromtimestamp(int(message['OBR'][0][6][0])) , "\n")
    #print("End of observation : ", datetime.fromtimestamp(int(message['OBR'][0][7])) , "\n")
    print("Type of observation : ", message['OBR'][0][4][0][3], "\n")
    print("\n ------------------------------------------\n")

def showOBXInformation(message):
    """ Affiche les informations du segment OBX """
    print("\n ------------------------------------------\n")
    print("OBX's Informations : \n")
    print("Observation identifier : ", message['OBX'][0][2][0], "\n")
    print("Observation value : ", message['OBX'][0][5][0][1], "\n")
    print("Units : ", message['OBX'][0][6][0], "\n")
    print("Reference range : ", str.replace(message['OBX'][0][7][0], '_', '-') , "\n")
    print("Abnormal flags : ", message['OBX'][0][8][0], "\n")
    print("\n ------------------------------------------\n")

def clear_console():
    if sys.platform.startswith('win'):
        _ = os.system('cls')
    else:
        _ = os.system('clear')

def write_to_file(data, filename="hl7_data.json"):
    try:
        with open(filename, 'w') as f:
            json.dump(data, f, indent=4)
        print(f"Data successfully written to {filename}")
    except Exception as e:
        print(f"Failed to write data to file: {e}")

""" ------------------------------------------------------  MAIN  ----------------------------------------------------------- """

# Création du serveur TCP
# Paramètres de l'écoute
HOST = '0.0.0.0' 
PORT = 2575

# Délimiteurs MLLP
START_BLOCK = b'\x0b'
END_BLOCK = b'\x1c\r'


# Créer la socket serveur
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
    server.bind((HOST, PORT))
    server.listen(1)
    print(f"Serveur MLLP en écoute sur {HOST}:{PORT}...")

    while True and not keyboard.is_pressed('q'):
        conn, addr = server.accept()
        with conn:
            print(f"Connexion reçue de {addr}")
            continue_listening = False
            while True:
                buffer = b""
                data = conn.recv(4096)
                if not data:
                    break
                buffer += data
                if END_BLOCK in buffer:

                    message = buffer.split(END_BLOCK)[0].lstrip(START_BLOCK)

                    hl7_message = message.decode(errors='ignore')
                    hl7_message = parse_hl7_message(hl7_message)

                    if not continue_listening:
                        print("Ecouter en continu ?")
                        choice = input("Choisissez une option (y/n): ")

                    if choice.lower() == 'y' or choice.lower() == 'yes':
                        continue_listening = True
                        HL7InformationMapping('3', hl7_message) # OBX data
                        continue 
                    else:
                        choice = -1
                        while choice != 4:

                            menu = """Menu:\n\t1. Identité du patient (PID)\n\t2. Observation (OBR)\n\t3. Resultat (OBX)\n\t4. Quitter"""
                            print(menu)
                            choice = input("Choisissez une option : ")

                            HL7InformationMapping(choice, hl7_message)
                        
                        sys.exit(0)
                    
                    

                    # Optionnel : envoyer un ACK (acknowledgement HL7)
                    ack = b'\x0bMSH|^~\\&|RECV|HOSP|SEND|LAB|202508041201||ACK^A01|MSG00001|P|2.3\rMSA|AA|MSG00001\x1c\r'
                    conn.sendall(ack)
                    break

