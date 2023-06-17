package com.sparksquad.ezcommerce.mobile.model.DAO;

import android.content.Context;
import android.os.Build;

import com.sparksquad.ezcommerce.mobile.dataAccess.NetworkUtility;
import com.sparksquad.ezcommerce.mobile.model.POJO.Purchase;
import com.sparksquad.ezcommerce.mobile.session.SessionData;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

public class PurchaseDAO {
    public static List<Purchase> consultUserPurchases(String token, Context context) {
        List<Purchase> purchases = new ArrayList<>();

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

        CompletableFuture<String> response = NetworkUtility.makeAsyncHTTPRequest(properties.getProperty("API_URL") + "/purchases/", token);

        try {
            String responseString = response.get();
            JSONArray jsonArray = new JSONArray(responseString);
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject jsonObject = jsonArray.getJSONObject(i);
                Purchase purchase = new Purchase();
                purchase.setId(jsonObject.getInt("purchaseId"));
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    purchase.setDate(LocalDate.parse(jsonObject.getString("purchaseDate")));
                }
                purchase.setTotal((float) jsonObject.getDouble("purchaseTotal"));
                purchases.add(purchase);
            }
        } catch (ExecutionException | InterruptedException | JSONException e) {
            e.printStackTrace();
        }

        return purchases;
    }

    public static void createPurchase(Purchase purchase, String accessToken, Context context) {
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

        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("quantity", purchase.getQuantity());
            jsonObject.put("paymentMethodId", purchase.getPaymentMethodId());
            jsonObject.put("productId", purchase.getProductId());
        } catch (JSONException e) {
            e.printStackTrace();
        }

        NetworkUtility.postAsyncHTTPRequest(properties.getProperty("API_URL") + "/purchases/" + SessionData.getInstance().getUsername(), jsonObject.toString(), accessToken);
        System.out.println(properties.getProperty("API_URL") + "/purchases/" + SessionData.getInstance().getUsername());
    }
}
