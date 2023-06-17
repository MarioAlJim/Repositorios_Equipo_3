package com.sparksquad.ezcommerce.mobile.model.DAO;

import android.content.Context;

import com.sparksquad.ezcommerce.mobile.dataAccess.NetworkUtility;
import com.sparksquad.ezcommerce.mobile.model.POJO.Refund;

import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class RefundDAO {
    public static void createRefund(Refund refund, String accessToken, Context context) {
        Properties properties = new Properties();
        InputStream inputStream = null;

        try {
            inputStream = context.getAssets().open("APIdata.properties");
            properties.load(inputStream);
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            // Close the input stream to release resources
            if (inputStream != null) {
                try {
                    inputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        JSONObject json = new JSONObject();
        try {
            json.put("purchaseId", refund.getPurchaseId());
            json.put("reason", refund.getReason());
        } catch (Exception e) {
            e.printStackTrace();
        }

        NetworkUtility.postAsyncHTTPRequest(properties.getProperty("API_URL") + "/refund/" + refund.getPurchaseId(), json.toString(), accessToken);
    }
}
