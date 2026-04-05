package com.pulsesync.sleep

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import com.google.android.gms.location.SleepClassifyEvent
import com.google.android.gms.location.SleepSegmentEvent
import org.json.JSONArray
import org.json.JSONObject

class SleepReceiver : BroadcastReceiver() {

    companion object {
        const val TAG = "SleepReceiver"
        const val PREFS_NAME = "SleepTrackerPrefs"
        const val KEY_UNPROCESSED_SLEEP_SEGMENTS = "unprocessed_sleep_segments"
    }

    override fun onReceive(context: Context, intent: Intent) {
        Log.d(TAG, "Received sleep intent")

        if (SleepSegmentEvent.hasEvents(intent)) {
            val sleepEvents = SleepSegmentEvent.extractEvents(intent)
            Log.d(TAG, "Extracted ${sleepEvents.size} sleep segment events")

            val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            val existingJsonStr = prefs.getString(KEY_UNPROCESSED_SLEEP_SEGMENTS, "[]")
            val jsonArray = JSONArray(existingJsonStr)

            for (event in sleepEvents) {
                // A status of 0 usually means success/successful sleep segment
                val eventObj = JSONObject().apply {
                    put("startTimeMillis", event.startTimeMillis)
                    put("endTimeMillis", event.endTimeMillis)
                    put("status", event.status)
                }
                jsonArray.put(eventObj)
                Log.d(TAG, "Recorded sleep segment: ${event.startTimeMillis} to ${event.endTimeMillis}")
            }

            // Save back to SharedPreferences
            prefs.edit().putString(KEY_UNPROCESSED_SLEEP_SEGMENTS, jsonArray.toString()).apply()

            // NOTIFY REACT NATIVE IF RUNNING
            SleepModule.instance?.let { module ->
                Log.d(TAG, "Notifying React Native of new sleep data")
                module.sendEvent(SleepModule.EVENT_SLEEP_UPDATE, jsonArray.toString())
            }
        }

        // We can also extract frequent "sleep classify" events if needed, but for total duration 
        // SleepSegmentEvent is the official structured data Google provides for a full sleep session.
    }
}
