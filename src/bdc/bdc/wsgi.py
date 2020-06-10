"""
WSGI config for bdc project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.9/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "bdc.settings.settings")
os.environ["DATABASE_NAME"] = "cde"
os.environ["DATABASE_USER"] = "cde"
os.environ["DATABASE_PASSWORD"] = "cde"
os.environ["DATABASE_HOST"] = "localhost"
os.environ["API_PUBLIC_URL"] = "http://api.acacs.org"
os.environ["API_INTERNAL_URL"] = "http://api.acacs.org"
os.environ["DJANGO_DEBUG"] = "True"
os.environ["NODE_ENV"] = "production"
os.environ["TZ"] = "Europe/Paris"

application = get_wsgi_application()
