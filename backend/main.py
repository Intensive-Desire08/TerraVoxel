from sklearn.tree import DecisionTreeClassifier as dtc
from sklearn.model_selection import train_test_split as tts
import pandas as pd
from sklearn.preprocessing import LabelEncoder
df=pd.read_csv("datas.csv")
x=df.iloc[:,1:7]
df_new=pd.get_dummies(x,dtype=int)
encoder=LabelEncoder()
y=encoder.fit_transform(df["recommended_crop"])
x_train,x_test,y_train,y_test=tts(df_new,y,test_size=0.3,random_state=42)
model=dtc()
model.fit(x_train,y_train)
arain=int(input("Enter your annual rainfall: "))
atemp=float(input("Enter your average temperature:"))
soilty=input("enter your soil type:")
soilph=float(input("enter your soil ph: "))
wava=input("enter water availablilit:")
lasta=input("enter the land status:")
inputs=[[arain,atemp,soilty,soilph,wava,lasta]]    
new_input=pd.DataFrame(inputs,columns=x.columns)
new_input=pd.get_dummies(new_input,dtype=int)
new_input=new_input.reindex(columns=df_new.columns,fill_value=0)
prediction=model.predict(new_input)
result=encoder.inverse_transform(prediction)
print(result)    



