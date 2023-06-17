package com.sparksquad.ezcommerce.mobile.model.POJO;

import android.os.Build;
import android.os.Parcel;
import android.os.Parcelable;

import androidx.annotation.NonNull;

import java.time.LocalDate;
import java.util.Objects;

public class Purchase implements Parcelable {
    private int id;
    private LocalDate date;
    private int quantity;
    private float total;
    private int paymentMethodId;
    private int productId;

    public Purchase(Parcel parcel) {
        id = parcel.readInt();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            date = LocalDate.parse(parcel.readString());
        }
        quantity = parcel.readInt();
        total = parcel.readFloat();
    }

    public Purchase() {
    }

    public static final Creator<Purchase> CREATOR = new Creator<Purchase>() {
        @Override
        public Purchase createFromParcel(Parcel in) {
            return new Purchase(in);
        }

        @Override
        public Purchase[] newArray(int size) {
            return new Purchase[size];
        }
    };

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public float getTotal() {
        return total;
    }

    public void setTotal(float total) {
        this.total = total;
    }

    public int getPaymentMethodId() {
        return paymentMethodId;
    }

    public void setPaymentMethodId(int paymentMethodId) {
        this.paymentMethodId = paymentMethodId;
    }

    public int getProductId() {
        return productId;
    }

    public void setProductId(int productId) {
        this.productId = productId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Purchase purchase = (Purchase) o;
        return id == purchase.id && quantity == purchase.quantity && Float.compare(purchase.total, total) == 0 && date.equals(purchase.date);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, date, quantity, total);
    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(@NonNull Parcel parcel, int i) {
        parcel.writeInt(id);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            parcel.writeString(date.toString());
        }
        parcel.writeInt(quantity);
        parcel.writeFloat(total);
    }
}
