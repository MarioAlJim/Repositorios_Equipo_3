package com.sparksquad.ezcommerce.mobile;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;

import com.sparksquad.ezcommerce.mobile.model.DAO.PurchaseDAO;
import com.sparksquad.ezcommerce.mobile.model.POJO.Product;
import com.sparksquad.ezcommerce.mobile.model.POJO.Purchase;
import com.sparksquad.ezcommerce.mobile.session.SessionData;

public class ConfirmPurchase extends AppCompatActivity {

    int quantity = 1;
    Product product;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Intent intent = getIntent();
        setContentView(R.layout.activity_confirm_purchase);
        if (intent.hasExtra("PRODUCT_EXTRA")) {
            product = intent.getParcelableExtra("PRODUCT_EXTRA");
        }
        /*new Thread(() -> {
            try {
                int productId = getIntent().getIntExtra("productId", 0);
                if (productId == 0) {
                    throw new Exception("Product ID not found");
                }
                product = ProductDAO.getProductById(productId, SessionData.getInstance().getAccessToken(), this);
                TextView productModel = findViewById(R.id.product_model);
                productModel.setText(product.getProductModel());
                TextView productPrice = findViewById(R.id.product_price);
                productPrice.setText(String.valueOf(product.getPrice()));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();*/
        TextView model = findViewById(R.id.product_model);
        model.setText(product.getProductModel());
        TextView price = findViewById(R.id.product_price);
        price.setText(String.valueOf(product.getPrice()));
        TextView quantityTextView = findViewById(R.id.quantity_display);
        quantityTextView.setText(String.valueOf(quantity));
        Button increaseQuantityButton = findViewById(R.id.plus_quantity_button);
        increaseQuantityButton.setOnClickListener(view -> {
            if (quantity < product.getInventory()) {
                quantity++;
                quantityTextView.setText(String.valueOf(quantity));
            } else {
                System.out.println("Not enough inventory");
            }
        });
        Button decreaseQuantityButton = findViewById(R.id.minus_quantity_button);
        decreaseQuantityButton.setOnClickListener(view -> {
            if (quantity > 1) {
                quantity--;
                quantityTextView.setText(String.valueOf(quantity));
            }
        });

        Button confirmButton = findViewById(R.id.buy_now_button);
        confirmButton.setOnClickListener(view -> confirmPurchase());
    }

    private void confirmPurchase() {
        new Thread(() -> {
            try {
                Purchase purchase = new Purchase();
                purchase.setProductId(product.getId());
                purchase.setQuantity(quantity);
                purchase.setPaymentMethodId(1);

                PurchaseDAO.createPurchase(purchase, SessionData.getInstance().getAccessToken(), this);
                //Go back to catalog activity
                Intent intent = new Intent(ConfirmPurchase.this, Catalog.class);
                startActivity(intent);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }
}