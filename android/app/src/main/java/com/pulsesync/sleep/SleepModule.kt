package com.pulsesync.sleep

import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.android.gms.location.ActivityRecognition

class SleepModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val MODULE_NAME = "SleepModule"
        const val PREFS_NAME = "SleepTrackerPrefs"
        const val KEY_UNPROCESSED_SLEEP_SEGMENTS = "unprocessed_sleep_segments"
        const val EVENT_SLEEP_UPDATE = "SleepDataUpdate"
        
        var instance: SleepModule? = null
    }

    init {
        instance = this
    }

    override fun getName(): String = MODULE_NAME

    private fun getSleepPendingIntent(): PendingIntent {
        val intent = Intent(reactContext, SleepReceiver::class.java)
        return PendingIntent.getBroadcast(
            reactContext,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_MUTABLE
        )
    }

    /**
     * Helper to send events to JS if React session is alive.
     */
    fun sendEvent(eventName: String, params: Any?) {
        if (reactContext.hasActiveCatalystInstance()) {
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(eventName, params)
        }
    }

    @ReactMethod
    fun startSleepTracking(promise: Promise) {
        // Checking for ACTIVITY_RECOGNITION permission
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val permissionStatus = ContextCompat.checkSelfPermission(
                reactContext,
                android.Manifest.permission.ACTIVITY_RECOGNITION
            )
            if (permissionStatus != PackageManager.PERMISSION_GRANTED) {
                promise.reject("PERMISSION_DENIED", "ACTIVITY_RECOGNITION permission is required.")
                return
            }
        }

        val client = ActivityRecognition.getClient(reactContext)
        val pendingIntent = getSleepPendingIntent()

        client.requestSleepSegmentUpdates(
            pendingIntent,
            com.google.android.gms.location.SleepSegmentRequest.getDefaultSleepSegmentRequest()
        ).addOnSuccessListener {
            promise.resolve(true)
        }.addOnFailureListener { e ->
            promise.reject("START_TRACKING_FAILED", e.message)
        }
    }

    @ReactMethod
    fun stopSleepTracking(promise: Promise) {
        val client = ActivityRecognition.getClient(reactContext)
        val pendingIntent = getSleepPendingIntent()

        client.removeSleepSegmentUpdates(pendingIntent)
            .addOnSuccessListener {
                promise.resolve(true)
            }.addOnFailureListener { e ->
                promise.reject("STOP_TRACKING_FAILED", e.message)
            }
    }

    @ReactMethod
    fun fetchUnprocessedSleepData(promise: Promise) {
        try {
            val prefs = reactContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            val existingJsonStr = prefs.getString(KEY_UNPROCESSED_SLEEP_SEGMENTS, "[]")
            
            // Clear the unprocessed segments so they aren't processed twice
            prefs.edit().remove(KEY_UNPROCESSED_SLEEP_SEGMENTS).apply()
            
            promise.resolve(existingJsonStr)
        } catch (e: Exception) {
            promise.reject("FETCH_DATA_FAILED", e.message)
        }
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // Keep RN happy
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Keep RN happy
    }
}
