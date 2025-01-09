const WebhookItem = ({id, dataType, eventType}) => {
    return (
        <div className="space-y-1 mb-4 sm:mb-0">
            <p className="font-medium break-all">ID: {id}</p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <p className="text-sm text-gray-500">
                Event: {eventType}
            </p>
            <p className="text-sm text-gray-500">
                Data: {dataType}
            </p>
            </div>
        </div>
    )
}

export default WebhookItem