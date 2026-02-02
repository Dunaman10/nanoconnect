Tabel yang dibutuhkan:
1. Users(ID, Name, Email, Password, CreatedAt, UserType['sme', 'influencer', ;admin])
2. Influencer(ID, UserID, FollowersCount, EngagementRate, Niche, Price per Cost, Etc)
3. Order (ID, InfluencerID, SMEID, OrderStatus['pending', 'completed', 'TotalPrice'], CreatedAt)
4. Review (ID, OrderID, Rating, Comment, CreatedAt)