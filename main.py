"""
Dumansız Gelecek - Kivy Android Uygulaması
WebView tabanlı uygulama
"""

from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.garden.webview import WebView
from kivy.core.window import Window

# Uygulamayı portrait modunda ayarla
Window.size = (540, 960)


class DumansizGelecekApp(App):
    """Dumansız Gelecek Kivy Uygulaması"""
    
    def build(self):
        """Uygulamayı oluştur"""
        layout = BoxLayout(orientation='vertical')
        
        # WebView oluştur ve siteyi yükle
        webview = WebView()
        webview.url = 'https://tolgauysal.github.io/dumansiz-gelecek/'
        
        layout.add_widget(webview)
        return layout


if __name__ == '__main__':
    app = DumansizGelecekApp()
    app.title = "Dumansız Gelecek"
    app.run()
