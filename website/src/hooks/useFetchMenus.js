import { useState, useEffect } from "react";
import AWS from "aws-sdk";
import { MENUS_TABLE_NAME, getUserRestaurantId } from "../aws-config";
import { useAuth } from "../context/AuthContext";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const useFetchMenus = () => {
  const { session } = useAuth();
  const [existingMenus, setExistingMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        if (!session) {
          console.warn("⚠️ No session found.");
          setLoading(false);
          return;
        }

        const restaurantId = getUserRestaurantId(session);
        if (!restaurantId) {
          console.warn("⚠️ No restaurantId found.");
          setLoading(false);
          return;
        }

        const params = {
          TableName: MENUS_TABLE_NAME,
          FilterExpression: "restaurantId = :rId",
          ExpressionAttributeValues: { ":rId": restaurantId }
        };

        const data = await dynamoDb.scan(params).promise();
        if (data.Items) {
          const menuNames = data.Items.map(menu => menu.name.toLowerCase());
          setExistingMenus(menuNames);
        } else {
          console.warn("⚠️ No existing menus found.");
        }
      } catch (error) {
        console.error("❌ Error fetching menus:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, [session]);

  return { existingMenus, loading };
};

export default useFetchMenus;
