package com.sparksquad.ezcommerce.mobile.model.DAO;

import android.content.Context;

import com.sparksquad.ezcommerce.mobile.dataAccess.NetworkUtility;
import com.sparksquad.ezcommerce.mobile.model.POJO.User;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

public class UserDAO {
    public static User logIn(String username, String password, Context context) throws IOException {
        User user = null;

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

        //Create new json with email and password
        JSONObject json = new JSONObject();
        try {
            json.put("username", username);
            json.put("password", password);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        CompletableFuture<String> response = NetworkUtility.postAsyncHTTPRequest(properties.getProperty("API_URL") + "/auth/customer/" + username, json.toString(), null);
        try {
            String responseString = response.get();
            JSONObject jsonObject = new JSONObject(responseString);
            user = new User();
            user.setUsername(jsonObject.getString("username"));
            user.setAccessToken(jsonObject.getString("token"));
        } catch (JSONException | NullPointerException | ExecutionException | InterruptedException e) {
            e.printStackTrace();
            try {
                System.out.println("Received response: " + response.get());
            } catch (ExecutionException | InterruptedException ex) {
                throw new RuntimeException(ex);
            }
        }

        return user;
    }
}
