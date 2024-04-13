from flask import Flask, jsonify
from flask_cors import CORS
from application.config import DevelopmentConfig
from application.sec import datastore
from flask_security import SQLAlchemyUserDatastore, Security
from application.models import db
from application.resources import api
from flask_migrate import Migrate
from application.worker import celery_init_app
from celery.schedules import crontab
from application.tasks import daily_reminder, toremind, mr
from application.instances import cache

def create_app():
    app=Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    migrate=Migrate(app,db)
    api.init_app(app)
    app.security=Security(app,datastore)
    cache.init_app(app)
    with app.app_context():
        import application.views
    
    return app

app=create_app()
celery_app = celery_init_app(app)

@celery_app.on_after_configure.connect
def send_email(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=21, minute=5),
        daily_reminder.s('admin@syncin.ac.in', "Reminder"),
    )

@celery_app.on_after_configure.connect
def reset_visited(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=23, minute=59),
        toremind.s(),    
    )

@celery_app.on_after_configure.connect
def monthly_report(sender,**kwargs):
    sender.add_periodic_task(
        crontab(day_of_month='12', hour='17', minute='26'),
        mr.s(),
    )

CORS(app,resources={r"/*":{'origins':"*"}})

if __name__=="__main__":
    app.run(debug=True)