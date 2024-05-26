import React, { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import GithubIcon from "./components/icon/GithubIcon";
import { isGistId, isUrl } from "./utils";
import { getItem, setItem } from "./localStorage";
import { InputEnum } from "./enum/localStorageKeyEnum";
import {
  pushNotice,
  HolyGrail,
  Appbar,
  Btn,
  Notifications,
  TextField,
  Footer,
} from "roku-ui";
import { ThemeToggle } from "./components/ThemeToggle";

export default function App() {
  const [gistIdOrUrl, setGistIdOrUrl] = useState("");

  useEffect(() => {
    const storedGistIdOrUrl = getStoredGistIdOrUrl();
    if (storedGistIdOrUrl) {
      setGistIdOrUrl(storedGistIdOrUrl);
    }
  }, []);

  const handleInput = (value: string) => {
    if (isUrl(value)) {
      const storedGistIdOrUrl = getItem(value);
      if (storedGistIdOrUrl === null || storedGistIdOrUrl !== value) {
        setGistIdOrUrl(value);
        setItem(InputEnum.Url, value);
      }
    } else if (isGistId(value)) {
      const storedGistIdOrUrl = getItem(value);
      if (storedGistIdOrUrl === null || storedGistIdOrUrl !== value) {
        setGistIdOrUrl(value);
        setItem(InputEnum.GistId, value);
      }
    } else {
      pushNotice({
        type: "danger",
        title: "Error",
        desc: "Invalid URL or Gist ID",
        name: "error",
      });
    }
  };

  return (
    <>
      <HolyGrail
        style={{ height: '100vh' }}
        header={
          <Appbar
            border
            style={{
              position: "fixed",
              top: 0,
              width: "100%",
              backgroundImage:
                "radial-gradient(hsl(var(--r-background-1), 0.25) 1px, hsl(var(--r-background-2)) 1px)",
              backgroundSize: "4px 4px",
            }}
            varient="blur"
            title="Wakatime Dashboard"
            tailing={
              <>
                <Input handleInput={handleInput} />
                <ThemeToggle />
                <Btn
                  text
                  icon
                  onClick={() =>
                    window.open(
                      "https://github.com/zzwtsy/wakatime-dashboard",
                      "_blank"
                    )
                  }
                >
                  <GithubIcon />
                </Btn>
              </>
            }
          />
        }
        main={<Dashboard gistIdOrUrl={gistIdOrUrl} />}
        footer={
          <Footer style={{ height: 50, borderBottom: "none" }}>
            <span style={{ margin: "0 auto" }}>
              Thanks{" "}
              <a href="https://wakatime.com" target="_blank">
                WakaTime
              </a>
            </span>
          </Footer>
        }
      />
      <Notifications name="error" stack={false} />
    </>
  );
}

interface InputProps {
  handleInput: (value: string) => void;
}

function Input({ handleInput }: InputProps) {
  const [value, setValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleInput(value);
      setValue("");
    }
  };

  return (
    <>
      <TextField
        style={{ width: 300 }}
        value={value}
        setValue={setValue}
        onKeyDown={handleKeyDown}
        placeholder="Input GistID or URL"
        color="primary"
      />
    </>
  );
}

function getStoredGistIdOrUrl() {
  return getItem(InputEnum.Url) || getItem(InputEnum.GistId) || null;
}
