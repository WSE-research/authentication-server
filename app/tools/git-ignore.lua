-- Private helper functions

function _exists(file)
    local ok, err, code = os.rename(file, file)
    if not ok then
        if code == 13 then
            -- Permission denied, but it exists
            return true
        end
    end
    return ok, err
end

function _isTrackedByGit(fileName)    
    return os.execute("git ls-files --error-unmatch "..fileName)
end

-- Commands

function ignoreFile(fileName)
    if type(fileName) ~= "string" or #fileName == 0 then 
        error("No valid file name was provided")
    end

    if not _exists(fileName) then 
        error("Error: file ./"..fileName.." does not exist.")
    else
        os.execute("echo \"\n# Ignored by command\n"..fileName.."\" >> .gitignore")
        if _isTrackedByGit(fileName) then
            local ranSuccessfully = os.execute("git rm --cached ./"..fileName)

            if not ranSuccessfully then
                error("There was an error removing the file from Git.")
            end
        end
    end
end

function ignoreDirectory(directoryName)
    if type(directoryName) ~= "string" or #directoryName == 0 then 
        error("No valid directory name was provided")
    end

    if directoryName:sub(#directoryName, #directoryName) ~= "/" then
        directoryName = directoryName.."/"
    end

    if not _exists(directoryName) then 
        error("Error: directory ./"..directoryName.." does not exist.")
    else
        os.execute("echo \"\n# Ignored by command\n"..directoryName.."\" >> .gitignore")
        if _isTrackedByGit(directoryName) then
            local ranSuccessfully = os.execute("git rm -r --cached ./"..directoryName)
            
            if not ranSuccessfully then
                error("There was an error removing the file from Git.")
            end
        end
    end
end

function debugInfo()
    os.execute("whoami && pwd && ls -A")
end

-- Command executor

if arg[1]:sub(1, 1) == "_" then
    error("Cannot run private functions")
end

local command = _G[arg[1]]

if type(command) ~= "function" then
    error("This command doesn't exist")
end

command(arg[2])