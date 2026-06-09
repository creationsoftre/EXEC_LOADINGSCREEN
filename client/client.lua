local ran = false

local function pushLoadscreenConfig()
    SendNUIMessage({
        type = 'loadscreenConfig',
        config = Config or {}
    })
end

AddEventHandler('onClientResourceStart', function(resourceName)
    if resourceName ~= GetCurrentResourceName() then
        return
    end

    CreateThread(function()
        for _ = 1, 20 do
            pushLoadscreenConfig()
            Wait(250)
        end
    end)
end)

AddEventHandler('playerSpawned', function()
    if not ran then
        ShutdownLoadingScreenNui()
        ran = true
    end
end)
