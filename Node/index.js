const app = require("./paymentSystem");
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`server listening at port - ${port}`);
});