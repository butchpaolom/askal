from django.apps import AppConfig


class AskConfig(AppConfig):
    name = 'ask'

    def ready(self):
        import ask.signals
