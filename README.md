# HL7 data receiver for IHP

This project is made for getting data from medical devices who uses the HL7 protocol.

Despite of using real medical devices on this project, a simulation script has been created to imitate a medical device.

## Content

This project is developed Python and contains two scripts : **sender.py** and **receiver.py**

## Libraries

- Socket : to manage socket message
- Sys : to manage system (quit a script)
- HL7 : to manage HL7 parsing
- Keyboard : to get event with keytouch
- OS : to manage the os such as file directory
- Json : to manage JSON file
- Datetime
- time

## How it's work
First, call the receiver.py script on the terminal. Then the sender. 

To quit, go to the receiver.py terminal and press Ctrl+C.

### sender.py
This script is the simulation script. The purpose is to send HL7 data to the receiver script.
It contains an array of three different HL7 messages sent to the receiver each second in a infinite loop.

    - 1st second : message 1
    - 2nd second : message 2
    - 3rd second : message 3
    - 4th second : message 1
    ...

Before being sent, each message is encoded, wrap with delimiters and sent in a socket to the receiver.

### receiver.py
This script is listening for socket. Once he receive data, he detect a message thanks to the same delimiter as put in the sender script and then he decode it. 
Then the message is parsed as a HL7 message to have a better treatment with python.

When the HL7 message is ready and parsed, the message (an array, not a string anymore) will be treated in a **JSON file destinated to the IHP platform**

The method **init_data_recording(hl7_message)** checks if a JSON file about the patient already exists in the system and otherwise, he create a new file named "patient_**patient_id**.json".
This method returns the name of the existing file or the name of the new file.

The file is initalized with patient infos (name, surname, sex, date of birth).
Also another sections is created, the records. 
It's an array section destinated to contain all the records sent by the sender (data value, unity, if it's anormal or no)

The records section is fill with the **write_to_file(record_entry, filename)** method. Record entry contains all the data of a record : 

    record_entry = {
        "Timestamp": DateTime,
        "ObservationID": String,
        "ObservationValue": String,
        "Units": String,
        "ReferenceRange": String,
        "AbnormalFlags": String 
    }

The most recent record is put at the beginning of the array.

## Previsions

At terms, the sender script as to be replace by a real medical device, or by Arduino or Raspberry device who can send socket. 

The receiver can be modify to put more informations on the JSON file.





