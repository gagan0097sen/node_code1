const getData = await Product.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user_details",
      },
    },
  ]);

// const getData = await Product.findOne({ userId: id }).populate({
//     path: "userId",
//     strictPopulate: false,
//     select: "email ",
//   });

  const updateProduct = await Product.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        name: name,
        quantity: quantity,
        price: price,
        image: image,
      },
    },
    { new: true }
  );