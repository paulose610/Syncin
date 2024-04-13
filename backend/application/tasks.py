from celery import shared_task
from .mail_service import send_message
from .models import User, Role, RolesUsers, Song, Cycledata, Album,db
from jinja2 import Template
import os
import matplotlib.pyplot as plt

current_dir = os.path.dirname(os.path.abspath(__file__))

@shared_task(ignore_result=True)
def daily_reminder(to, subject):
    html_file_path = os.path.join(current_dir, 'reminder.html')
    users = User.query.filter(User.visited==False)
    for user in users:
        with open(html_file_path, 'r') as f:
            template = Template(f.read())
            send_message(user.email, subject,
                         template.render(user=user.username))
    return "OK"

@shared_task(ignore_result=True)
def toremind():
    users = User.query.join(RolesUsers).join(Role).filter(Role.name != 'admin').all()
    for u in users:
        u.visited=False
    db.session.commit()    

@shared_task(ignore_result=True)
def add_to_last_played(uid,sid):
    user=User.query.filter(User.id==uid).first()
    lp=user.last_played.split(',')   
    lp=[id for id in lp if id]
    if len(lp)>4:
        lp.pop(-1)
    lp=[str(sid)]+lp
    lp=set(lp)
    lp=list(lp)
    user.last_played = ','.join(lp)
    db.session.commit()


@shared_task(ignore_result=True)
def mr():
    chart_dir=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..','assets','charts')

    creators = User.query.join(RolesUsers).join(Role).filter(Role.name == 'creator').all()
    albums=Cycledata.query.filter(Cycledata.type=='album').order_by(Cycledata.plays.desc()).all()
    ta=len(albums)
    songs=Cycledata.query.filter(Cycledata.type=='song').order_by(Cycledata.plays.desc()).all()
    ts=len(songs)
    for creator in creators:
        ds={'title':[],'plays':[]}
        s=0
        msl=0
        t=0
        print(songs)
        for song in songs:
            s+=1
            if song.creator_id==creator.id:
                title=Song.query.filter(Song.id==song.item_id).first()
                if title: 
                    t+=1
                    title=title.title
                    ds['title'].append(f'{title}\nTop {int((s/ts)*100)}%')
                    ds['plays'].append(song.plays)
                    if t==1: msl=song.plays      

        da={'title':[],'plays':[]}
        s=0
        mal=0
        t=0
        for album in albums:
            s+=1
            if album.creator_id==creator.id:
                title=Album.query.filter(Album.id==album.item_id).first()
                if title: 
                    t+=1
                    title=title.name
                    da['title'].append(f'{title}\nTop {int((s/ta)*100)}%')
                    da['plays'].append(album.plays)
                    if t==1: mal=album.plays 
        
        html_file_path = os.path.join(current_dir, 'monthly_report.html')
        if os.path.exists(html_file_path):
            with open(html_file_path, 'r') as f:
                template = Template(f.read())
                renderedmr=template.render(da=da,ds=ds,mal=mal,msl=msl)
                send_message(creator.email, 'Monthly-Report',
                            renderedmr)

        db.session.query(Cycledata).delete()
        db.session.commit()













