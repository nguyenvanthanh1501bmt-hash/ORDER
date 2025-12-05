'use client';

import { useEffect, useState } from "react";
import { getFoodList } from "../../service/Food/Food_list";
import AddFoodModal from "../../service/Food/AddFoodModal";
import Image from "next/image";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";

export default function Foodpage() {
    const [foodList, setFoodList] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchFoodList = async () => {
        const data = await getFoodList();
        setFoodList(data || []);
    };

    useEffect(() => {
        fetchFoodList();
    }, []);

    return (
        <div className="p-6 space-y-6 relative">
        <h1 className="text-2xl font-bold">Food Page</h1>

        {/* Danh sách món ăn */}
        <div className="space-y-4">
            {foodList.length === 0 ? (
                <p>Chưa có món ăn</p>
            ) : (
                foodList.map((food) => (
                <Card
                    key={food.id}
                    className="shadow-md border rounded-lg overflow-hidden flex flex-row h-40 w-full hover:shadow-lg transition"
                >
                    {/* Ảnh món ăn */}
                    {food.image_url ? (
                    <div className="relative w-1/3 h-full">
                        <Image
                            src={food.image_url}
                            alt={food.name}
                            fill
                            style={{ objectFit: "contain" }}
                            sizes="(max-width: 768px) 100vw, 33vw"
                            priority
                            className="rounded-l"
                        />
                    </div>
                    ) : (
                    <div className="w-1/3 h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                        Không có ảnh
                    </div>
                    )}

                    {/* Thông tin món ăn */}
                    <div className="w-2/3 p-4 flex flex-col justify-between">
                        <CardHeader className="p-0">
                            <CardTitle>{food.name}</CardTitle>
                            <CardDescription>
                                {food.sub_category || "Không có mô tả"}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="p-0">
                            <p className="font-semibold">Giá: {food.price}đ</p>
                            {food.category && (
                                <p className="text-sm text-gray-500">Danh mục: {food.category}</p>
                            )}
                        </CardContent>
                    </div>
                </Card>
                ))
            )}
        </div>

        {/* Nút mở modal thêm món */}
        <Card
            className="cursor-pointer flex items-center justify-center p-6 hover:shadow-lg transition border rounded-lg"
            onClick={() => setIsAddModalOpen(true)}
        >
            <CardHeader className="text-center">
            <CardTitle className="text-lg">+ Thêm món ăn</CardTitle>
            </CardHeader>
        </Card>

        {/* Modal thêm món */}
        {isAddModalOpen && (
            <AddFoodModal
            open={isAddModalOpen}
            onOpenChange={(state) => {
                setIsAddModalOpen(state);
                if (!state) fetchFoodList();
            }}
            />
        )}
        </div>
    );
}
