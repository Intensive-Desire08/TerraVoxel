import pandas as pd


class TreeData:

    def __init__(self, csv_file):

        self.data = pd.read_csv(
            csv_file
        )


    def get_tree(self, tree_name):

        result = self.data[
            self.data["name"] == tree_name
        ]

        if result.empty:
            return None

        return result.iloc[0]