package com.sparksquad.ezcommerce.mobile;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;

import com.sparksquad.ezcommerce.mobile.model.DAO.UserDAO;
import com.sparksquad.ezcommerce.mobile.model.POJO.User;
import com.sparksquad.ezcommerce.mobile.session.SessionData;

import java.io.IOException;

public class MainActivity extends AppCompatActivity {

    private EditText usernameEditText;
    private EditText passwordEditText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        usernameEditText = findViewById(R.id.loginUsernameField);
        passwordEditText = findViewById(R.id.loginPasswordField);

        Button loginButton = findViewById(R.id.loginButton);
        loginButton.setOnClickListener(view -> logIn(usernameEditText.getText().toString(), passwordEditText.getText().toString()));
    }

    private void logIn(String username, String password) {
        System.out.println("Username: " + username);
        System.out.println("Password: " + password);

        new Thread(() -> {
            try {
                User userLogin = UserDAO.logIn(username, password, this);
                if (userLogin != null && userLogin.getAccessToken() != null) {
                    runOnUiThread(() -> {
                        System.out.println("User logged in successfully");
                        SessionData.getInstance().setAccessToken(userLogin.getAccessToken());
                        SessionData.getInstance().setUsername(userLogin.getUsername());
                        System.out.println("Username: " + SessionData.getInstance().getUsername());
                        System.out.println("Access token: " + SessionData.getInstance().getAccessToken());
                        Intent intent = new Intent(MainActivity.this, Catalog.class);
                        startActivity(intent);
                    });
                } else {
                    runOnUiThread(() -> System.out.println("User not found"));
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }).start();
    }
}