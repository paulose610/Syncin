# Syncin
music streaming web app

Backend-Flask Frontend-Vue3

Project report: https://drive.google.com/file/d/1jkuA3l2cPJ-5Gn6KLAG0S3DhXyoXFDM8/view?usp=drive_link

##To Run:

Install all the dependencies from the backend directory

Ubuntu command: pip install -r req.txt (venv)

command to run python file (main.py): python3 main.py

In the Frontend directory:

install all dependencies: npm install (all dependencies in package.json)

install and use redis: redis-server

For celery tasks: celery -A main.celery_app worker --loglevel=INFO (inside backend directory)

For celery beat scheduled tasks: celery -A main.celery_app beat --loglevel=INFO (inside backend directory)

All emails are sent through Mailhog.

