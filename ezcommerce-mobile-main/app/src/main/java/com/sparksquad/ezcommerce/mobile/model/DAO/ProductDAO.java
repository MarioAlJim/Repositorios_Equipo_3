package com.sparksquad.ezcommerce.mobile.model.DAO;

import android.content.Context;

import com.sparksquad.ezcommerce.mobile.dataAccess.NetworkUtility;
import com.sparksquad.ezcommerce.mobile.model.POJO.Product;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Properties;
import java.util.concurrent.CompletableFuture;

public class ProductDAO {
    public static Product getProductById(int id, String token, Context context) {
        Product product = null;

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

        CompletableFuture<String> response = NetworkUtility.makeAsyncHTTPRequest(properties.getProperty("API_URL") + "/product/" + id, token);
        try {
            String responseString = response.get();
            JSONObject jsonObject = new JSONObject(responseString);
            product = new Product();
            product.setId(jsonObject.getInt("id"));
            product.setInventory(jsonObject.getInt("inventory"));
            product.setProductModel(jsonObject.getString("productModel"));
            product.setPrice(jsonObject.getDouble("price"));
            product.setSize(jsonObject.getDouble("size"));
            product.setBrandId(jsonObject.getInt("brandId"));
            product.setCategoryId(jsonObject.getInt("categoryId"));
        } catch (Exception e) {
            e.printStackTrace();
        }

        return product;
    }

    public static ArrayList<Product> getProducts(String token, Context context) {
        ArrayList<Product> products = new ArrayList<>();
        Properties properties = new Properties();
        InputStream inputStream = null;
        try {
            inputStream = context.getAssets().open("APIdata.properties");
            properties.load(inputStream);
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (inputStream != null) {
                try {
                    inputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        CompletableFuture<String> response = NetworkUtility.makeAsyncHTTPRequest(properties.getProperty("API_URL") + "/products", token);
        try {
            String responseString = response.get();
            //print response code
            System.out.println(responseString);
            JSONArray jsonProducts =  new JSONArray(responseString);
            System.out.println(jsonProducts.length());
            for (int i = 0; i < jsonProducts.length(); i++) {
                Product product;
                JSONObject jsonObject = jsonProducts.getJSONObject(i);
                product = new Product();
                product.setId(jsonObject.getInt("id"));
                product.setInventory(jsonObject.getInt("inventory"));
                product.setProductModel(jsonObject.getString("model"));
                product.setPrice(jsonObject.getDouble("price"));
                product.setSize(jsonObject.getDouble("size"));
                product.setBrandId(jsonObject.getInt("brandId"));
                product.setCategoryId(jsonObject.getInt("categoryId"));
                products.add(product);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return products;
    }
}
