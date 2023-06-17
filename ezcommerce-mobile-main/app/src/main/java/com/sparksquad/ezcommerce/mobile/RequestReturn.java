package com.sparksquad.ezcommerce.mobile;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.widget.AdapterView;

import com.sparksquad.ezcommerce.mobile.databinding.ActivityRequestReturnBinding;
import com.sparksquad.ezcommerce.mobile.adapters.PurchaseAdapter;
import com.sparksquad.ezcommerce.mobile.model.DAO.PurchaseDAO;
import com.sparksquad.ezcommerce.mobile.model.POJO.Purchase;
import com.sparksquad.ezcommerce.mobile.session.SessionData;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class RequestReturn extends AppCompatActivity {

    ActivityRequestReturnBinding binding;

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        binding = ActivityRequestReturnBinding.inflate(getLayoutInflater());
        binding.recyclerView.setLayoutManager(new LinearLayoutManager(this));

        PurchaseAdapter purchaseAdapter = new PurchaseAdapter();
        binding.recyclerView.setAdapter(purchaseAdapter);
        //purchaseAdapter.submitList(getPurchases());

        //this is a dummy list of purchases
        List<Purchase> purchases = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            Purchase purchase = new Purchase();
            purchase.setId(i);
            purchase.setQuantity(i);
            purchase.setTotal(i * 10);
            purchase.setDate(LocalDate.now());
            purchases.add(purchase);
        }
        purchaseAdapter.submitList(purchases);

        //when an item is clicked, it will open the RefundScreen activity after parceling the purchase object of the selected item
        purchaseAdapter.setOnItemClickListener(new PurchaseAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(Purchase purchase) {
                Intent intent = new Intent(RequestReturn.this, RefundScreen.class);
                intent.putExtra("purchase", purchase);
                startActivity(intent);
            }
        });

        setContentView(binding.getRoot());
    }

    private List<Purchase> getPurchases() {
        return PurchaseDAO.consultUserPurchases(SessionData.getInstance().getAccessToken(), this);
    }
}