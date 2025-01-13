import { logger, task, wait } from "@trigger.dev/sdk/v3";
import { connectToDatabase } from "@/lib/mongodb";
import Data from "@/app/models/Data";

export const saveEventTask = task({
  id: "save-event",
  queue: {
    concurrencyLimit: 1,
  },
  maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
  run: async (payload) => {
    console.log("Payload received: ", payload)

    await connectToDatabase()
    const newEvent = new Data(payload)
    await newEvent.save()
    console.log("Saved event to database", { newEvent })

    return newEvent
  },
});