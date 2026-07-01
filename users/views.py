from django.contrib.auth.forms import AuthenticationForm, PasswordChangeForm
from .forms import UserRegisterForm, UserUpdateForm
from django.shortcuts import render,redirect
from django.contrib.auth import login,authenticate
from django.contrib.auth.decorators import login_required
from movies.models import Movie , Booking
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth import logout
import json

def home(request):
    movies= Movie.objects.all()
    return render(request,'home.html',{'movies':movies})
def register(request):
    if request.method == 'POST':
        form=UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            username=form.cleaned_data.get('username')
            password=form.cleaned_data.get('password1')
            user=authenticate(username=username,password=password)
            login(request,user)
            return redirect('profile')
    else:
        form=UserRegisterForm()
    return render(request,'users/register.html',{'form':form})

def login_view(request):
    if request.method == 'POST':
        form=AuthenticationForm(request,data=request.POST)
        if form.is_valid():
            user=form.get_user()
            login(request,user)
            return redirect('/')
    else:
        form=AuthenticationForm()
    return render(request,'users/login.html',{'form':form})

@login_required
def profile(request):
    bookings= Booking.objects.filter(user=request.user)
    if request.method == 'POST':
        u_form = UserUpdateForm(request.POST, instance=request.user)
        if u_form.is_valid():
            u_form.save()
            return redirect('profile')
    else:
        u_form = UserUpdateForm(instance=request.user)

    return render(request, 'users/profile.html', {'u_form': u_form,'bookings':bookings})

@login_required
def reset_password(request):
    if request.method == 'POST':
        form=PasswordChangeForm(user=request.user,data=request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form=PasswordChangeForm(user=request.user)
    return render(request,'users/reset_password.html',{'form':form})
@ensure_csrf_cookie
@require_http_methods(["GET"])
def api_me(request):
    if request.user.is_authenticated:
        return JsonResponse({
            "authenticated": True,
            "user": {
                "id": request.user.id,
                "username": request.user.username,
                "email": request.user.email,
            }
        })

    return JsonResponse({
        "authenticated": False
    })


@require_http_methods(["POST"])
def api_login(request):
    data = json.loads(request.body)

    username = data.get("username")
    password = data.get("password")

    user = authenticate(
        request,
        username=username,
        password=password,
    )

    if user is None:
        return JsonResponse(
            {
                "success": False,
                "message": "Invalid username or password."
            },
            status=400,
        )

    login(request, user)

    return JsonResponse({
        "success": True,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
        }
    })


@require_http_methods(["POST"])
def api_logout(request):
    logout(request)

    return JsonResponse({
        "success": True
    })


@require_http_methods(["POST"])
def api_signup(request):
    data = json.loads(request.body)

    form = UserRegisterForm({
        "username": data.get("username"),
        "email": data.get("email"),
        "password1": data.get("password"),
        "password2": data.get("password"),
    })

    if not form.is_valid():
        return JsonResponse(
            {
                "success": False,
                "errors": form.errors,
            },
            status=400,
        )

    user = form.save()

    login(request, user)

    return JsonResponse({
        "success": True,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
        }
    })