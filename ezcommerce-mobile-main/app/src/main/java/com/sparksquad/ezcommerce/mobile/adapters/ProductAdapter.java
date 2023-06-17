package com.sparksquad.ezcommerce.mobile.adapters;

import android.view.LayoutInflater;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.DiffUtil;
import androidx.recyclerview.widget.ListAdapter;
import androidx.recyclerview.widget.RecyclerView;

import com.sparksquad.ezcommerce.mobile.databinding.ProductItemBinding;
import com.sparksquad.ezcommerce.mobile.model.POJO.Product;

public class ProductAdapter extends ListAdapter<Product, ProductAdapter.ProductViewHolder> {
    public static final DiffUtil.ItemCallback<Product> DIFF_CALLBACK =
            new DiffUtil.ItemCallback<Product>() {
                @Override
                public boolean areItemsTheSame(
                        @NonNull Product oldP, @NonNull Product newP) {
                    return oldP.getId() == newP.getId();
                }

                @Override
                public boolean areContentsTheSame(
                        @NonNull Product oldP, @NonNull Product newP) {
                    return oldP.getId() == newP.getId();
                }
            };

    public ProductAdapter() {
        super(DIFF_CALLBACK);
    }

    private OnItemClickListener onItemClickListener;

    public interface OnItemClickListener {
        void onItemClick(Product product);
    }

    public void setOnItemClickListener(OnItemClickListener onItemClickListener) {
        this.onItemClickListener = onItemClickListener;
    }

    @NonNull
    @Override
    public ProductViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        ProductItemBinding binding =
                ProductItemBinding.inflate(LayoutInflater.from(parent.getContext()));
        return new ProductViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull ProductAdapter.ProductViewHolder holder, int position) {
        Product product = getItem(position);
        holder.bind(product);

    }

    public class ProductViewHolder extends RecyclerView.ViewHolder {
        private final ProductItemBinding binding;
        public ProductViewHolder(@NonNull ProductItemBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }
        public void bind(Product product) {

            binding.productModel.setText(product.getProductModel());
            binding.productPrice.setText(String.valueOf(product.getPrice()));
            binding.getRoot().setOnClickListener( v -> {
                onItemClickListener.onItemClick(product);
            });
            binding.executePendingBindings();
        }
    }
}