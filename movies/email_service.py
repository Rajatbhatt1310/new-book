import logging

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.html import strip_tags

from .models import EmailDelivery

logger = logging.getLogger("movies.email")


def send_booking_confirmation(payment, recipient_email):
    """
    Sends booking confirmation email and updates EmailDelivery status.
    Returns: "sent" or "failed"
    """

    email_delivery, _ = EmailDelivery.objects.get_or_create(
        payment=payment,
        defaults={
            "recipient_email": recipient_email,
            "subject": f"Booking Confirmed - {payment.theater.movie.name}",
            "status": "queued",
        },
    )

    try:
        context = {
            "user": payment.user,
            "payment": payment,
            "movie": payment.theater.movie,
            "theater": payment.theater,
            "seats": payment.seats.all(),
            "amount": payment.amount / 100,
        }

        html_content = render_to_string(
            "emails/booking_confirmation.html",
            context,
        )

        text_content = strip_tags(html_content)

        message = EmailMultiAlternatives(
            subject=email_delivery.subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient_email],
        )

        print("=" * 60)
        print("EMAIL_BACKEND:", settings.EMAIL_BACKEND)
        print("EMAIL_HOST:", settings.EMAIL_HOST)
        print("EMAIL_PORT:", settings.EMAIL_PORT)
        print("EMAIL_USE_TLS:", settings.EMAIL_USE_TLS)
        print("EMAIL_HOST_USER:", settings.EMAIL_HOST_USER)
        print("DEFAULT_FROM_EMAIL:", settings.DEFAULT_FROM_EMAIL)
        print("TO:", recipient_email)
        print("SUBJECT:", email_delivery.subject)
        print("=" * 60)

        result = message.send()
        
        print("SEND RESULT:", result)

        email_delivery.status = "sent"
        email_delivery.sent_at = timezone.now()
        email_delivery.last_error = ""
        email_delivery.save()

        logger.info(
            "Booking confirmation email sent to %s",
            recipient_email,
        )

        return "sent"

    except Exception as exc:
        import traceback

        full_error = traceback.format_exc()
    
        print("=" * 60)
        print("EMAIL SEND FAILED")
        print(full_error)
        print("=" * 60)
    
        email_delivery.status = "failed"
        email_delivery.retry_count += 1
        email_delivery.last_error = full_error
        email_delivery.save()
    
        logger.exception(
            "Failed to send booking confirmation email."
        )
    
        return "failed"