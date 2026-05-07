from django.urls import path
from django.contrib.auth import views as auth_views

from . import views

urlpatterns = [
    path("signup/", views.signup, name="signup"),
    path("articles/", views.articles_list, name="article_list"),
    path("articles/new", views.create_article, name="article_create"),
    path("articles/<int:article_id>", views.article_details, name="article_details"),
    path(
        "comment/<int:comment_id>/delete/", views.delete_comment, name="comment_delete"
    ),
    path(
        "login/", auth_views.LoginView.as_view(template_name="login.html"), name="login"
    ),
    path("logout/", auth_views.LogoutView.as_view(), name="logout"),
]
