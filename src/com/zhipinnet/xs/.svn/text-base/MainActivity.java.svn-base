package com.example.xs;

import android.app.AlertDialog;
import android.content.ComponentName;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import org.apache.cordova.DroidGap;

public class MainActivity extends DroidGap {

    @Override
	public void onCreate(Bundle savedInstanceState) {
    	System.setProperty("http.keepAlive", "false");
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/login.html", 3000);
        //if(checkNetWorkStatus()){
    	//}
    }
    
    /**
	 * check network Status
	 * 
	 * @return boolean
	 */

	public boolean checkNetWorkStatus() {
		boolean result;
		ConnectivityManager cm = (ConnectivityManager) this
				.getSystemService(Context.CONNECTIVITY_SERVICE);
		NetworkInfo netinfo = cm.getActiveNetworkInfo();
		if (netinfo != null && netinfo.isConnected()) { // The current network is not available
			result = true;
		} else { //  not available
			new AlertDialog.Builder(MainActivity.this).setMessage(
					"The available network connection, please open the network connections").setPositiveButton("OK",
					new DialogInterface.OnClickListener() {
						public void onClick(DialogInterface dialoginterface,
								int i) {
							ComponentName cn = new ComponentName(
									"com.android.settings",
									"com.android.settings.Settings");
							Intent intent = new Intent();
							intent.setComponent(cn);
							intent.setAction("android.intent.action.VIEW");
							startActivity(intent);
							finish();
						}
					}).show();
			result = false;
		}
		return result;
	}

}
