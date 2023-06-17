package com.sparksquad.ezcommerce.mobile;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;

import com.sparksquad.ezcommerce.mobile.adapters.ProductAdapter;
import com.sparksquad.ezcommerce.mobile.databinding.ActivityCatalogBinding;
import com.sparksquad.ezcommerce.mobile.model.DAO.ProductDAO;
import com.sparksquad.ezcommerce.mobile.model.POJO.Product;
import com.sparksquad.ezcommerce.mobile.session.SessionData;

import java.util.ArrayList;

public class Catalog extends AppCompatActivity implements ProductAdapter.OnItemClickListener {

    ActivityCatalogBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityCatalogBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        binding.productRecycler.setLayoutManager(new LinearLayoutManager(this));
        ProductAdapter adapter = new ProductAdapter();
        adapter.setOnItemClickListener(this);
        binding.productRecycler.setAdapter(adapter);



        new Thread(() -> {
            try {
                ArrayList<Product> products = new ArrayList<>();
                //products = ProductDAO.getProducts(SessionData.getInstance().getAccessToken(), this);
                products = ProductDAO.getProducts(SessionData.getInstance().getAccessToken(),this);
                if (!products.isEmpty()) {
                    ArrayList<Product> finalProducts = products;
                    runOnUiThread(() -> {
                        System.out.println("Products");
                        adapter.submitList(finalProducts);
                    });
                } else {
                    runOnUiThread(() -> System.out.println("Products not found"));
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }

    @Override
    public void onItemClick(Product product) {
        Intent intent = new Intent(Catalog.this, ConfirmPurchase.class);
        intent.putExtra("PRODUCT_EXTRA", product);
        startActivity(intent);
        Toast.makeText(this, "Producto seleccionado: " + product.getProductModel(), Toast.LENGTH_SHORT).show();
    }
}
