from flask import current_app as app, send_from_directory, jsonify, send_file
from .config import Config
import os
from .models import User, Song, Album
from flask_restful import marshal, fields
from .instances import cache
import redis
import io
from flask_security import auth_token_required, current_user, roles_required
from .tasks import *
import matplotlib.pyplot as plt

@app.route('/',methods=['GET'])
def home():
    return('welcome')


@app.route('/cover/<filename>')
@cache.cached(timeout=1800)
def get_cover(filename):
    redis_conn = redis.Redis()
    cover_image= redis_conn.get(filename)
    if cover_image: return send_file(io.BytesIO(cover_image),mimetype='image/jpeg') 
    else:
        cover_path=os.path.join(Config.UPLOAD_FOLDER,filename)   
        if not os.path.exists(cover_path):
            cover_image=redis_conn.get('defaultcover') 
            if cover_image:
                return send_file(io.BytesIO(cover_image),mimetype='image/jpeg')    
            else:
                cover_path=os.path.join(Config.UPLOAD_FOLDER,'defaultcover.jpg')
                filename='defaultcover'
        with open(cover_path, 'rb') as f:
            cover_image = f.read()
            redis_conn.set(filename, cover_image)   

    return send_file(io.BytesIO(cover_image),mimetype='image/jpeg')


@app.route('/audio/<filename>')
@cache.cached(timeout=1800)
def get_audio(filename):
    redis_conn = redis.Redis()
    audio_file= redis_conn.get(filename)
    if audio_file: return send_file(io.BytesIO(audio_file),mimetype='audio/mp3') 
    else:
        audio_path=os.path.join(Config.UPLOAD_FOLDER,filename) 
        if not os.path.exists(audio_path):
            audio_file=redis_conn.get('defaultaudio')    
            if audio_file:
                return send_file(io.BytesIO(audio_file),mimetype='audio/mp3')
            else:    
                audio_path=os.path.join(Config.UPLOAD_FOLDER,'defaultaudio.mp3')
                filename='defaultaudio'
        with open(audio_path, 'rb') as f:
            audio_file = f.read()
            redis_conn.set(filename, audio_file)   

    return send_file(io.BytesIO(audio_file),mimetype='audio/mp3')

@app.route('/getcreators',methods=['GET'])
def get_creators():
    creators=User.query.filter(User.creator_name!='').all()
    creator_fields={
        'id': fields.Integer,
        'creator_name': fields.String,
        'clikes': fields.Integer 
    }
    data = marshal(creators, creator_fields)
    response = jsonify(data)
    return response

@app.route('/getusers',methods=['GET'])
def get_users():
    creators=User.query.filter(User.creator_name == None, User.email!='admin@syncin.ac.in').all()
    creator_fields={
        'id': fields.Integer,
        'username': fields.String,
    }
    data = marshal(creators, creator_fields)
    response = jsonify(data)
    return response


@app.route('/charts',methods=['GET'])
@auth_token_required
@roles_required('admin')
def marcharts():
    s,crtrs,a,fs={'songs':[],'likes':[]},{'artists':[],'likes':[]},{'albums':[],'likes':[]},{'songs':[],'flags':[]}
    chart_dir=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..','assets','charts')
    
    creators = User.query.filter(User.roles.any(Role.name == 'creator')).with_entities(User.creator_name, User.clikes).all()
    creators.sort(key=lambda x: x[1], reverse=True)
    songs=Song.query.with_entities(Song.title,Song.creator_id,Song.likes,Song.flags).all()
    songs.sort(key=lambda x: x[2], reverse=True)
    albums=Album.query.with_entities(Album.name,Album.creator_id,Album.likes).all()
    albums.sort(key=lambda x: x[2], reverse=True)
    
    for song in songs:
        if song.likes>0:
            aname=User.query.filter(User.id==song.creator_id).first().creator_name
            s['songs'].append(f'{song.title} by {aname}')
            s['likes'].append(song.likes)
    
    plt.bar(s['songs'],s['likes'])
    plt.xlabel('Song Titles')
    plt.ylabel('Total Likes')
    plt.title('Song Performance')
    plt.xticks(rotation=45)
    plt.tight_layout()

    img_path = os.path.join(chart_dir, 'song_chart.png')  
    plt.savefig(img_path)
    plt.close()

    for album in albums:
        if album.likes>0:
            aname=User.query.filter(User.id==album.creator_id).first().creator_name
            a['albums'].append(f'{album.name} by {aname}')
            a['likes'].append(album.likes)

    plt.bar(a['albums'],a['likes'])
    plt.xlabel('Album Titles')
    plt.ylabel('Total Likes')
    plt.title('ALbum Performance')
    plt.xticks(rotation=45)
    plt.tight_layout()

    img_path = os.path.join(chart_dir, 'album_chart.png')  
    plt.savefig(img_path)  
    plt.close()  

    for c in creators:
        if c.clikes>0:
            crtrs['artists'].append(f'{c.creator_name}')
            crtrs['likes'].append(c.clikes)
    print(crtrs)
    plt.bar(crtrs['artists'],crtrs['likes'])
    plt.xlabel('Artist')
    plt.ylabel('Total Likes')
    plt.title('Artist Performance')
    plt.xticks(rotation=45)
    plt.tight_layout()

    img_path = os.path.join(chart_dir, 'artist_chart.png')  
    plt.savefig(img_path)  
    plt.close() 

    songs.sort(key=lambda x: x[3], reverse=True)
    for song in songs:
        if song.flags>0:
            aname=User.query.filter(User.id==song.creator_id).first().creator_name
            fs['songs'].append(f'{song.title} by {aname}')
            fs['flags'].append(song.flags)

    plt.bar(fs['songs'],fs['flags'])
    plt.xlabel('Song Titles')
    plt.ylabel('Total flags')
    plt.title('Song Performance')
    plt.xticks(rotation=45)
    plt.tight_layout()

    img_path = os.path.join(chart_dir, 'fsong_chart.png')  
    plt.savefig(img_path)
    plt.close()
    return 'OK',200


@app.route('/viewchart/<filename>')
def get_chart(filename):
    chart_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets', 'charts')
    chart_path = os.path.join(chart_dir, filename)

    if not os.path.exists(chart_path):
        return send_from_directory(chart_dir, 'charterror.jpg', mimetype='image/jpeg')
    
    return send_from_directory(chart_dir, filename, mimetype='image/jpeg')



