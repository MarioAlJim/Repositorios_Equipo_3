package com.sparksquad.ezcommerce.mobile.adapters;

import android.view.LayoutInflater;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.DiffUtil;
import androidx.recyclerview.widget.ListAdapter;
import androidx.recyclerview.widget.RecyclerView;

import com.sparksquad.ezcommerce.mobile.databinding.PurchaseListItemBinding;
import com.sparksquad.ezcommerce.mobile.model.POJO.Purchase;

public class PurchaseAdapter extends ListAdapter<Purchase, PurchaseAdapter.PurchaseViewHolder> {

    public static final DiffUtil.ItemCallback<Purchase> DIFF_CALLBACK = new DiffUtil.ItemCallback<Purchase>() {
        @Override
        public boolean areItemsTheSame(@NonNull Purchase oldItem, @NonNull Purchase newItem) {
            return oldItem.getId() == newItem.getId();
        }

        @Override
        public boolean areContentsTheSame(@NonNull Purchase oldItem, @NonNull Purchase newItem) {
            return oldItem.equals(newItem);
        }
    };

    public PurchaseAdapter() {
        super(DIFF_CALLBACK);
    }

    private OnItemClickListener listener;

    public interface OnItemClickListener {
        void onItemClick(Purchase purchase);
    }

    public void setOnItemClickListener(OnItemClickListener listener) {
        this.listener = listener;
    }

    @NonNull
    @Override
    public PurchaseAdapter.PurchaseViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        PurchaseListItemBinding binding = PurchaseListItemBinding.inflate(LayoutInflater.from(parent.getContext()));
        return new PurchaseViewHolder(binding);
    }

    @Override
    public void onBindViewHolder(@NonNull PurchaseAdapter.PurchaseViewHolder holder, int position) {
        Purchase purchase = getItem(position);
        holder.bind(purchase);
    }

    class PurchaseViewHolder extends RecyclerView.ViewHolder {

        private final PurchaseListItemBinding binding;

        public PurchaseViewHolder(@NonNull PurchaseListItemBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
            itemView.setOnClickListener(v -> {
                int position = getAdapterPosition();
                if (listener != null && position != RecyclerView.NO_POSITION) {
                    listener.onItemClick(getItem(position));
                }
            });
        }

        public void bind(Purchase purchase) {
            binding.purchaseListItemName.setText(purchase.getDate().toString());
            binding.purchaseListItemPrice.setText(String.valueOf(purchase.getTotal()));
        }
    }
}
