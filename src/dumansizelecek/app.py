"""
Dumansız Gelecek - BeeWare Uygulaması
Android WebView Wrapper
"""

from jnius import autoclass, cast
from android.runnable import run_on_ui_thread


class DumansizGelecekApp:
    """WebView tabanlı uygulama"""
    
    def __init__(self):
        self.activity = self.get_activity()
        
    def get_activity(self):
        """PythonActivity örneğini al"""
        PythonActivity = autoclass('org.kivy.android.PythonActivity')
        return PythonActivity.mActivity
        
    @run_on_ui_thread
    def create_webview(self):
        """WebView oluştur ve yapılandır"""
        # Android sınıflarını yükle
        WebView = autoclass('android.webkit.WebView')
        WebViewClient = autoclass('android.webkit.WebViewClient')
        WebChromeClient = autoclass('android.webkit.WebChromeClient')
        LinearLayout = autoclass('android.widget.LinearLayout')
        LayoutParams = autoclass('android.view.ViewGroup$LayoutParams')
        
        # Layout'u kur
        layout = LinearLayout(self.activity)
        layout.setLayoutParams(
            LinearLayout.LayoutParams(
                LayoutParams.MATCH_PARENT,
                LayoutParams.MATCH_PARENT
            )
        )
        
        # WebView oluştur
        webview = WebView(self.activity)
        webview.setLayoutParams(
            LinearLayout.LayoutParams(
                LayoutParams.MATCH_PARENT,
                LayoutParams.MATCH_PARENT
            )
        )
        
        # WebView ayarları
        settings = webview.getSettings()
        settings.setJavaScriptEnabled(True)
        settings.setDomStorageEnabled(True)
        settings.setDatabaseEnabled(True)
        settings.setMixedContentMode(0)  # MIXED_CONTENT_ALWAYS_ALLOW
        
        # Site yükle
        webview.loadUrl('https://tolgauysal.github.io/dumansiz-gelecek/')
        
        # Layout'a ekle
        layout.addView(webview)
        
        # Activity'ye set et
        self.activity.setContentView(layout)
        
    def run(self):
        """Uygulamayı çalıştır"""
        self.create_webview()


def main():
    """Ana giriş noktası"""
    app = DumansizGelecekApp()
    app.run()
