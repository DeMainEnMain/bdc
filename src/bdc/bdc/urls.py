"""bureaudechange URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from django.contrib.auth.views import login, logout
from django.core.urlresolvers import reverse_lazy

from base import views as base_views
from manager import views as manager_views
from members import views as members_views

urlpatterns = [
    # built-in Django i18n:
    # from django.conf.urls import include, i18n
    # url(r'^i18n/', include(i18n)),
    url(r'^i18n/setlang_custom/$', base_views.setlang_custom, name='setlang_custom'),

    # JavaScript config for this Django/React app
    url(r'^config\.js$', base_views.config_js, name='config_js'),
    # login
    url(r'^login/?$', login, {'template_name': 'login.html'}, name='login'),
    # logout
    url(r'^logout/?$', logout, {'next_page': reverse_lazy('member-search')}, name='logout'),

    # our bureau de change Django apps
    url(r'^members/(?P<member_id>\d+)/?$', members_views.index, name='member-show'),
    url(r'^members/add$', members_views.add, name='member-add'),
    url(r'^members/subscription/add/(?P<member_id>\d+)/?$',
        members_views.add_subscription, name='member-subscription-add'),
    url(r'^members/search$', members_views.search, name='member-search'),

    url(r'^manager/?$', manager_views.index, name='manager'),

    url(r'^admin/', admin.site.urls),
]
