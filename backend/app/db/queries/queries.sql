-- Pairs
Insert into Pairs(name,status,createdAt,updatedAt) Values("BTT/USDT",TRUE,datetime('now'),datetime('now'))
Select * from Pairs
Delete from Pairs Where id=5
Update Pairs Set status=false where name="BTT/USDT"
DROP TABLE Pairs

-- Parameters
Select * from Parameters
Update Parameters set iscronrunning=false where id=1
DROP TABLE Parameters

-- Users
Select * from Users
DROP TABLE Users