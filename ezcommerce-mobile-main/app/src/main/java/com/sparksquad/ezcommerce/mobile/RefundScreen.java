package com.sparksquad.ezcommerce.mobile;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.ListView;
import android.widget.TextView;

import com.google.android.material.textfield.TextInputEditText;
import com.sparksquad.ezcommerce.mobile.model.DAO.RefundDAO;
import com.sparksquad.ezcommerce.mobile.model.POJO.Purchase;
import com.sparksquad.ezcommerce.mobile.model.POJO.Refund;
import com.sparksquad.ezcommerce.mobile.session.SessionData;

public class RefundScreen extends AppCompatActivity {

    TextView purchaseDate;
    TextView purchaseQuantity;
    TextView purchasePrice;
    Button returnButton;
    Button confirmButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Intent intent = getIntent();
        Purchase purchase = intent.getParcelableExtra("purchase");

        setContentView(R.layout.activity_refund_screen);

        purchaseDate = findViewById(R.id.refund_title);
        purchaseDate.setText(purchase.getDate().toString());

        purchaseQuantity = findViewById(R.id.purchase_quantity);
        purchaseQuantity.setText(String.valueOf(purchase.getQuantity()));

        purchasePrice = findViewById(R.id.purchase_total);
        purchasePrice.setText(String.valueOf(purchase.getTotal()));

        returnButton = findViewById(R.id.return_button);
        returnButton.setOnClickListener(view -> returnPurchase());

        confirmButton = findViewById(R.id.confirm_refund_button);
        confirmButton.setOnClickListener(view -> confirmRefund(purchase));
    }

    private void confirmRefund(Purchase purchase) {
        TextInputEditText refundReason = findViewById(R.id.refund_reason);
        if (refundReason.getText().toString().isEmpty()) {
            refundReason.setError("Por favor ingrese una razón para la devolución");
        } else if (refundReason.getText().toString().length() > 500 || refundReason.getText().toString().length() < 20) {
            refundReason.setError("La razón de la devolución debe de ser entre 20 y 500 caracteres");
        } else {
            Refund refund = new Refund();
            refund.setReason(refundReason.getText().toString());
            refund.setPurchaseId(purchase.getId());
            RefundDAO.createRefund(refund, SessionData.getInstance().getAccessToken(), this);
        }
    }

    private void returnPurchase() {
        //go back to RequestReturn activity
        Intent intent = new Intent(this, RequestReturn.class);
        startActivity(intent);
    }
}