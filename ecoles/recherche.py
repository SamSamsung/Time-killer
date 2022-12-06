from datetime import *
import requests

def recup():
    f = requests.get("https://sheets.googleapis.com/v4/spreadsheets/1hfbC7soGHjyXzdiIR8Rhu5WVEcUdKvUycHcQ64aUTNM/values/list?key=%20AIzaSyDvbaVWI5348HQBiuuNtz1LGAWzYFv9k6c")
    # La requete sera sous une forme non analysable.
    file = f.json()
    #On le transform en un dictionnaire

    return file["values"]

def parcours(file):
    L_inf = []
    L_date = []
    L_heures = []
    L_ecole = []
    L_jours = []
    L_evenements = []

    date_aujourd = datetime.now()
    for i in range(1, len(file)-1):
        for j in range(1, len(file[i])-1):
            # On enlève 1 a chaque fois car on a les noms du tableau qui ne sont pas utiles
            if "/" in file[i][j]:
                ecole = file[i][0]
                evenement = file[0][j]
                valeurs = file[i][j].split("&")
                for w in range(len(valeurs)):
                    val = valeurs[w].split(" ")
                    inf, heure = "(information non précisée)", "(heure non précisée)" #Dans le cas ou il n'y a pas d'infos ni d'heures
                    for z in range(len(val)):
                        if "(" in val[z]:
                            inf = val[z].replace("(","").replace(")", "")
                        elif "$" in val[z]:
                            heure = val[z].replace("$","")
                        elif "/" in val[z]:
                            date = val[z]
                    jours = jours_entre_deux(date, date_aujourd)
                    if 0 <= jours <= 7:
                        L_inf.append(inf)
                        L_date.append(date)
                        L_heures.append(heure)
                        L_ecole.append(ecole)
                        L_jours.append(jours)
                        L_evenements.append(evenement)
    if len(L_date) > 0:
        mail(L_inf, L_date, L_heures, L_ecole, L_jours, L_evenements)
                


def jours_entre_deux(date, date_auj):
    date_format = "%d/%m/%Y"
    date = datetime.strptime(date, date_format)
    return (date - date_auj).days
    


def mail(L_inf, L_date, L_heures, L_ecole, L_jours, L_evenements):
    import smtplib
    from email.mime.multipart import MIMEMultipart
    from email.mime.text import MIMEText
    from email.mime.base import MIMEBase
    from email import encoders
    s = smtplib.SMTP(host='smtp.gmail.com', port=587)
    s.starttls()
    s.login("Samuel.lelouch06@gmail.com", "dfsxdietbwwojccy")
    # Send the message
    msg = MIMEMultipart()

    # Parameters of the message :
    msg['From'] = "Samuel.lelouch06@gmail.com"
    msg['To'] = "Samuel.lelouch06@gmail.com,cahnsandrine@gmail.com"
    
    msg['Subject'] = "Rappel Ecoles !"

    text = ""
    for i in range(len(L_date)):
        value = "\n"+str(i+1)+ " -" + " L'école " + L_ecole[i] + " a une " + L_evenements[i].lower() + " le " + str(L_date[i]) + " en " + str(L_inf[i]) + " a " + str(L_heures[i]) + "." + " L'évenement aura lieu dans " + str(L_jours[i]) + " jours."
        text += value
    msg.attach(MIMEText(
        f"""
        Bonjour à vous !

        Petit rappel pour vous dire que les évenements suivants vont avoir lieu dans moins d'une semaine :
        {text}
        """
    ))
    s.send_message(msg)
    print("Mail envoyé")



# Lancer le code principal
parcours(recup())


"""
import calendar

year = 2022
month = "03"
month = int(month)
print(calendar.month(year, month))
print(calendar.calendar(year))
"""


"""# import the module
import calendar
# create the object
html_cal = calendar.HTMLCalendar(firstweekday=0)
year = 2023
month = 3
print(html_cal.formatyear(year))
"""