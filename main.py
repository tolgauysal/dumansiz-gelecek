"""
Dumansız Gelecek - APK Uygulaması
Android WebView Wrapper
"""

from jnius import autoclass, cast
from android.runnable import run_on_ui_thread

# Android sınıflarını yükle
PythonActivity = autoclass('org.kivy.android.PythonActivity')
WebView = autoclass('android.webkit.WebView')
WebViewClient = autoclass('android.webkit.WebViewClient')
WebChromeClient = autoclass('android.webkit.WebChromeClient')
LinearLayout = autoclass('android.widget.LinearLayout')
LayoutParams = autoclass('android.view.ViewGroup$LayoutParams')


class DumansizGelecekApp:
    """WebView tabanlı uygulama"""
    
    def __init__(self):
        self.activity = PythonActivity.mActivity
        
    @run_on_ui_thread
    def create_webview(self):
        """WebView oluştur ve yapılandır"""
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


if __name__ == '__main__':
    app = DumansizGelecekApp()
    app.create_webview()
