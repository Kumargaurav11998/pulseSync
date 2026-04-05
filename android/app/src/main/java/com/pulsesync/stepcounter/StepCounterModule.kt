package com.pulsesync.stepcounter

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * StepCounterModule
 *
 * Uses Android's hardware TYPE_STEP_COUNTER sensor which is a physical chip in the phone.
 * The chip counts steps 24/7 at the hardware level — it does NOT require any service or app
 * to be running. Steps accumulated while the app is killed are captured when the app reopens
 * by reading the offset difference from SharedPreferences.
 *
 * This approach requires NO persistent notification.
 */
class StepCounterModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), SensorEventListener {

    companion object {
        const val MODULE_NAME = "StepCounterModule"
        const val PREFS_NAME = "StepCounterPrefs"
        const val KEY_TODAY_STEPS = "today_steps"
        const val KEY_STEPS_OFFSET = "steps_offset"
        const val KEY_LAST_RESET_DATE = "last_reset_date"
        const val TAG = "StepCounterModule"
        const val STEP_UPDATE_EVENT = "StepCountUpdate"
    }

    private val sensorManager = reactContext.getSystemService(Context.SENSOR_SERVICE) as SensorManager
    private var stepCounterSensor: Sensor? = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER)
    private var isListening = false

    override fun getName(): String = MODULE_NAME

    /**
     * Start listening to the hardware step sensor.
     * Call this when the app comes to foreground.
     * The hardware counts steps even when we're not listening — this just enables real-time UI updates.
     */
    @ReactMethod
    fun startCounting() {
        if (isListening) return

        stepCounterSensor?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_NORMAL)
            isListening = true
            Log.d(TAG, "Step counter sensor listener registered")
        } ?: run {
            Log.w(TAG, "This device does not have a hardware step counter sensor")
        }
    }

    /**
     * Stop listening to sensor events (when app goes to background to save battery).
     * Steps are still counted by hardware — they are read on next startCounting() call.
     */
    @ReactMethod
    fun stopCounting() {
        if (!isListening) return
        sensorManager.unregisterListener(this)
        isListening = false
        Log.d(TAG, "Step counter sensor listener unregistered")
    }

    /**
     * Read today's step count from SharedPreferences.
     * This always works — even right after app launch from killed state —
     * because the hardware counted steps and we persist every update.
     */
    @ReactMethod
    fun getTodaySteps(promise: Promise) {
        try {
            val prefs = reactContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            val steps = prefs.getLong(KEY_TODAY_STEPS, 0L)
            promise.resolve(steps.toDouble())
        } catch (e: Exception) {
            promise.reject("GET_STEPS_ERROR", e.message)
        }
    }

    /**
     * Check if the hardware step counter sensor is available on this device.
     */
    @ReactMethod
    fun isSupported(promise: Promise) {
        promise.resolve(stepCounterSensor != null)
    }

    // ── SensorEventListener ────────────────────────────────────────────────

    override fun onSensorChanged(event: SensorEvent?) {
        if (event?.sensor?.type != Sensor.TYPE_STEP_COUNTER) return

        val hardwareStepsSinceReboot = event.values[0].toLong()
        val prefs = reactContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

        // Check if we need to reset for a new day
        val today = java.text.SimpleDateFormat("yyyy-MM-dd", java.util.Locale.getDefault())
            .format(java.util.Date())
        val lastResetDate = prefs.getString(KEY_LAST_RESET_DATE, "")

        var offset = prefs.getLong(KEY_STEPS_OFFSET, -1L)

        if (lastResetDate != today) {
            // New day OR first-ever run: set offset to current hardware reading
            offset = hardwareStepsSinceReboot
            prefs.edit()
                .putLong(KEY_STEPS_OFFSET, offset)
                .putLong(KEY_TODAY_STEPS, 0L)
                .putString(KEY_LAST_RESET_DATE, today)
                .apply()
            Log.d(TAG, "New day '$today' — offset reset to $offset")
            emitSteps(0L)
            return
        }

        if (offset == -1L) {
            // First reading of the day — initialize offset
            offset = hardwareStepsSinceReboot
            prefs.edit().putLong(KEY_STEPS_OFFSET, offset).apply()
            Log.d(TAG, "First reading — offset set to $offset")
            emitSteps(0L)
            return
        }

        // Handle device reboot (hardware counter resets to 0 after reboot)
        if (hardwareStepsSinceReboot < offset) {
            Log.d(TAG, "Device reboot detected — adjusting offset")
            offset = hardwareStepsSinceReboot
            prefs.edit().putLong(KEY_STEPS_OFFSET, offset).apply()
        }

        val todaySteps = hardwareStepsSinceReboot - offset
        prefs.edit().putLong(KEY_TODAY_STEPS, todaySteps).apply()
        Log.d(TAG, "Today's steps: $todaySteps")
        emitSteps(todaySteps)
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}

    private fun emitSteps(steps: Long) {
        try {
            reactContext
                .getJSModule(com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                ?.emit(STEP_UPDATE_EVENT, steps.toDouble())
        } catch (e: Exception) {
            Log.e(TAG, "Error emitting steps: ${e.message}")
        }
    }

    // Required by React Native for NativeEventEmitter
    @ReactMethod
    fun addListener(eventName: String) { /* no-op */ }

    @ReactMethod
    fun removeListeners(count: Int) { /* no-op */ }
}
