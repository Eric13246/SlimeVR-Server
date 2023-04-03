package dev.slimevr

import android.os.Bundle
import android.webkit.WebView
import androidx.appcompat.app.AppCompatActivity
import io.eiren.util.logging.LogManager
import io.ktor.server.engine.embeddedServer
import io.ktor.server.http.content.*
import io.ktor.server.netty.Netty
import io.ktor.server.routing.routing
import java.io.File
import kotlin.concurrent.thread
import kotlin.system.exitProcess


class MainActivity : AppCompatActivity() {
	override fun onCreate(savedInstanceState: Bundle?) {
		super.onCreate(savedInstanceState)
		setContentView(R.layout.activity_main)

		// Host the web GUI server
		embeddedServer(Netty, port = 8080) {
			routing {
				static("/") {
					staticBasePackage = "web-gui"
					resources()
					defaultResource("index.html")
				}
			}
		}.start(wait = false)

		// Load the web GUI web page
		val guiWebView = findViewById<WebView>(R.id.guiWebView)
		guiWebView.settings.javaScriptEnabled = true
		guiWebView.settings.domStorageEnabled = true
		guiWebView.settings.setSupportZoom(true)
		guiWebView.loadUrl("http://localhost:8080/")

		thread(start = true, name = "Main VRServer Thread") {
			try {
				LogManager.initialize(filesDir)
			} catch (e1: java.lang.Exception) {
				e1.printStackTrace()
			}
			LogManager.info("Running version $VERSION")
			try {
				vrServer = VRServer(File(filesDir, "vrconfig.yml").absolutePath)
				vrServer.start()
				Keybinding(vrServer)
				vrServer.join()
				LogManager.closeLogger()
				exitProcess(0)
			} catch (e: Throwable) {
				e.printStackTrace()
				exitProcess(1)
			}
		}
	}
}