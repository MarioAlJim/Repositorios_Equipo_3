package com.sparksquad.ezcommerce.mobile.dataAccess;

import java.util.concurrent.CompletableFuture;
import java.io.IOException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class NetworkUtility {
    private static final OkHttpClient client = new OkHttpClient();
    private static final ExecutorService executorService = Executors.newFixedThreadPool(5);

    public static CompletableFuture<String> makeAsyncHTTPRequest(String url, String bearerToken) {
        CompletableFuture<String> future = new CompletableFuture<>();

        executorService.execute(() -> {
            if (bearerToken != null && !bearerToken.isEmpty()) {
                Request request = new Request.Builder()
                        .url(url)
                        .addHeader("Authorization", "Bearer " + bearerToken)
                        .addHeader("Origin", "http://ezc.vadam.xyz")
                        .get()
                        .build();

                try (Response response = client.newCall(request).execute()) {
                    String responseBody = response.body().string();
                    future.complete(responseBody);
                } catch (IOException e) {
                    future.completeExceptionally(e);
                }
            }
            Request request = new Request.Builder()
                    .url(url)
                    .get()
                    .build();

            try (Response response = client.newCall(request).execute()) {
                String responseBody = response.body().string();
                future.complete(responseBody);
            } catch (IOException e) {
                future.completeExceptionally(e);
            }
        });

        return future;
    }

    public static CompletableFuture<String> postAsyncHTTPRequest(String url, String json, String bearerToken) {
        CompletableFuture<String> future = new CompletableFuture<>();

        executorService.execute(() -> {
            RequestBody body = RequestBody.create(json, MediaType.parse("application/json; charset=utf-8"));
            Request request = new Request.Builder()
                    .url(url)
                    .addHeader("Authorization", "Bearer " + bearerToken)
                    .addHeader("Origin", "http://ezc.vadam.xyz")
                    .post(body)
                    .build();

            try (Response response = client.newCall(request).execute()) {
                String responseBody = response.body().string();
                future.complete(responseBody);
            } catch (IOException e) {
                future.completeExceptionally(e);
            }
        });

        return future;
    }

    public static CompletableFuture<String> putAsyncHTTPRequest(String url, String json, String bearerToken) {
        CompletableFuture<String> future = new CompletableFuture<>();

        executorService.execute(() -> {
            RequestBody body = RequestBody.create(json, MediaType.parse("application/json; charset=utf-8"));
            Request request = new Request.Builder()
                    .url(url)
                    .addHeader("Authorization", "Bearer " + bearerToken)
                    .addHeader("Origin", "")
                    .put(body)
                    .build();

            try (Response response = client.newCall(request).execute()) {
                String responseBody = response.body().string();
                future.complete(responseBody);
            } catch (IOException e) {
                future.completeExceptionally(e);
            }
        });

        return future;
    }

    public static CompletableFuture<String> deleteAsyncHTTPRequest(String url, String bearerToken) {
        CompletableFuture<String> future = new CompletableFuture<>();

        executorService.execute(() -> {
            Request request = new Request.Builder()
                    .url(url)
                    .addHeader("Authorization", "Bearer " + bearerToken)
                    .addHeader("Origin", "http://ezc.vadam.xyz")
                    .delete()
                    .build();

            try (Response response = client.newCall(request).execute()) {
                String responseBody = response.body().string();
                future.complete(responseBody);
            } catch (IOException e) {
                future.completeExceptionally(e);
            }
        });

        return future;
    }
}
