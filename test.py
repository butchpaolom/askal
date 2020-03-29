import requests
import json

data = {
    "question":"how are you?",
    "anonymous":"false",
    "asked":"50",
}
z = input("1. Anon\n2. Account\n")
if z == "1":
    r = requests.post('http://localhost/ask/api/question/', data=data)
elif z == "2":
    cred = {
        "username":"kalasag",
        "password":"chasemebitch11"
        }   
    t = requests.post('http://localhost/api/token', data=cred)
    headers = {
        "Authorization": 'Bearer ' + t.json()['access']
        }
    r = requests.post('http://localhost/ask/api/question/', data=data, headers=headers)


print(r.json())