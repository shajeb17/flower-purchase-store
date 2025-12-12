require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const Stripe = require("stripe");

const port = process.env.PORT || 3000;
const app = express();
// middleware
app.use(
  cors({
    origin: [process.env.CLIEN_DOMEN],
    credentials: true,
    optionSuccessStatus: 200,
  })
);
const stripe = new Stripe(process.env.STRIPE_KEY);

app.use(express.json());

const uri = process.env.MONGO_URL;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // await client.connect();
    const flowerSide = client.db("flowerSide");
    const flower = flowerSide.collection("flower");

    app.get("/flower", async (req, res) => {
      let cursor = await flower.find().toArray();
      res.send(cursor);
    });

    app.get("/plant/:id", async (req, res) => {
      const id = req.params.id;
      const plant = await flower.findOne({ _id: new ObjectId(id) });
      res.send(plant);
    });

    app.post("/flower", async (req, res) => {
      let mainval = await flower.insertOne(req.body);
      res.send(mainval);
    });

    app.post("/create-payment-intent", async (req, res) => {
      try {
        let data = req.body;
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: data.name,
                  description: data.description,
                  images: [data.images],
                },
                unit_amount: data.price * 100, // convert to cents
              },
              quantity: data.quantity,
            },
          ],
          customer_email: data?.userInfo?.email,
          mode: "payment",
          metadata: {
            plantId: String(data?.userId),
            customerEmail: data?.userInfo?.email,
          },
          success_url: `${process.env.CLIEN_DOMEN}/payment_success`,
          cancel_url: `${process.env.CLIEN_DOMEN}/plant/${data?.userId}`,
        });
        res.json({ url: session.url });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello from Server..");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
