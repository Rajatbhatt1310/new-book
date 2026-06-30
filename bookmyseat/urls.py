from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.views.static import serve

from movies import views as movie_views

urlpatterns = [
    path("admin/", admin.site.urls),

    # Debug API
    path("api/debug/", movie_views.debug_view),

    # Movie APIs
    path("api/movies/", movie_views.api_movie_list),
    path("api/movies/<int:movie_id>/", movie_views.api_movie_detail),

    # Theater APIs
    path("api/theaters/", movie_views.api_theater_list),
    path("api/theaters/<int:theater_id>/", movie_views.api_theater_detail),

    # Seat APIs
    path("api/seats/", movie_views.api_seat_list),

    # Booking APIs
    path("api/bookings/", movie_views.api_create_booking),
    path("api/lock-seats/", movie_views.lock_seats),
    path("api/confirm-booking/", movie_views.confirm_booking),

    # Payment APIs
    path(
        "api/create-payment-order/",
        movie_views.create_payment_order,
    ),

    path(
        "api/admin/analytics/",
        movie_views.admin_analytics_api,
    ),

    path(
        "api/verify-payment/",
        movie_views.verify_payment,
    ),

    path(
        "api/razorpay-webhook/",
        movie_views.razorpay_webhook,
    ),

    # React assets
    path(
        "assets/<path:path>",
        serve,
        {
            "document_root": settings.FRONTEND_DIR / "assets",
        },
    ),

    # Media files (works in production too)
    path(
        "media/<path:path>",
        serve,
        {
            "document_root": settings.MEDIA_ROOT,
        },
    ),
]

# Local development static/media
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )

# React SPA routes (MUST BE LAST)
urlpatterns += [
    path(
        "",
        TemplateView.as_view(template_name="index.html"),
    ),
    path(
        "<path:path>",
        TemplateView.as_view(template_name="index.html"),
    ),
]