import pandas as pd

from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder


class TreePredictor:

    def __init__(self, csv_file):

        self.df = pd.read_csv(csv_file)

        self.x = self.df.iloc[:, 1:7]

        self.x_encoded = pd.get_dummies(
            self.x,
            dtype=int
        )

        self.encoder = LabelEncoder()

        self.y = self.encoder.fit_transform(
            self.df["recommendedtrees"]
        )

        self.model = DecisionTreeClassifier(
            random_state=42
        )

        self.train_model()


    def train_model(self):

        x_train, _, y_train, _ = train_test_split(
            self.x_encoded,
            self.y,
            test_size=0.3,
            random_state=42
        )

        self.model.fit(
            x_train,
            y_train
        )


    def predict(
        self,
        rainfall,
        temperature,
        soil_type,
        soil_ph,
        water_availability,
        land_status
    ):

        input_data = pd.DataFrame(
            [[
                rainfall,
                temperature,
                soil_type,
                soil_ph,
                water_availability,
                land_status
            ]],
            columns=self.x.columns
        )

        input_encoded = pd.get_dummies(
            input_data,
            dtype=int
        )

        input_encoded = input_encoded.reindex(
            columns=self.x_encoded.columns,
            fill_value=0
        )

        prediction = self.model.predict(
            input_encoded
        )

        tree = self.encoder.inverse_transform(
            prediction
        )[0]

        return tree