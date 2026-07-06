"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import type { LanguageCode } from "../_i18n/translations";
import { LanguageSwitcher } from "./language-switcher";
import type { CabinetCopy } from "./employees-section-copy";

const settingsCopy = {
  uk: {
    logoTitle: "Логотип компанії",
    logoDescription: "Додай невеликий PNG, JPG або WebP логотип. Він збережеться в профілі компанії.",
    uploadLogo: "Завантажити логотип",
    removeLogo: "Видалити логотип",
    logoSaved: "Логотип збережено.",
    passwordTitle: "Змінити пароль",
    passwordDescription: "Введи новий пароль для акаунта робочого простору.",
    currentPassword: "Старий пароль",
    newPassword: "Новий пароль",
    repeatPassword: "Повтори пароль",
    savePassword: "Зберегти пароль",
    passwordSaved: "Пароль оновлено.",
    passwordTooShort: "Пароль має містити щонайменше 8 символів.",
    passwordsMismatch: "Паролі не збігаються.",
    fileTooLarge: "Логотип має бути до 1 МБ.",
    fileUnsupported: "Обери файл PNG, JPG або WebP.",
  },
  en: {
    logoTitle: "Company logo",
    logoDescription: "Add a small PNG, JPG, or WebP logo. It will be saved to the company profile.",
    uploadLogo: "Upload logo",
    removeLogo: "Remove logo",
    logoSaved: "Logo saved.",
    passwordTitle: "Change password",
    passwordDescription: "Enter a new password for the workspace account.",
    currentPassword: "Current password",
    newPassword: "New password",
    repeatPassword: "Repeat password",
    savePassword: "Save password",
    passwordSaved: "Password updated.",
    passwordTooShort: "Password must be at least 8 characters.",
    passwordsMismatch: "Passwords do not match.",
    fileTooLarge: "Logo must be up to 1 MB.",
    fileUnsupported: "Choose a PNG, JPG, or WebP file.",
  },
  de: {
    logoTitle: "Firmenlogo",
    logoDescription:
      "Füge ein kleines PNG-, JPG- oder WebP-Logo hinzu. Es wird im Firmenprofil gespeichert.",
    uploadLogo: "Logo hochladen",
    removeLogo: "Logo entfernen",
    logoSaved: "Logo gespeichert.",
    passwordTitle: "Passwort ändern",
    passwordDescription: "Gib ein neues Passwort für das Arbeitsbereichskonto ein.",
    currentPassword: "Aktuelles Passwort",
    newPassword: "Neues Passwort",
    repeatPassword: "Passwort wiederholen",
    savePassword: "Passwort speichern",
    passwordSaved: "Passwort aktualisiert.",
    passwordTooShort: "Das Passwort muss mindestens 8 Zeichen lang sein.",
    passwordsMismatch: "Passwörter stimmen nicht überein.",
    fileTooLarge: "Das Logo darf höchstens 1 MB groß sein.",
    fileUnsupported: "Wähle eine PNG-, JPG- oder WebP-Datei.",
  },
  pl: {
    logoTitle: "Logo firmy",
    logoDescription: "Dodaj małe logo PNG, JPG albo WebP. Zostanie zapisane w profilu firmy.",
    uploadLogo: "Prześlij logo",
    removeLogo: "Usuń logo",
    logoSaved: "Logo zapisane.",
    passwordTitle: "Zmień hasło",
    passwordDescription: "Wpisz nowe hasło do konta przestrzeni pracy.",
    currentPassword: "Stare hasło",
    newPassword: "Nowe hasło",
    repeatPassword: "Powtórz hasło",
    savePassword: "Zapisz hasło",
    passwordSaved: "Hasło zaktualizowane.",
    passwordTooShort: "Hasło musi mieć co najmniej 8 znaków.",
    passwordsMismatch: "Hasła nie są takie same.",
    fileTooLarge: "Logo może mieć maksymalnie 1 MB.",
    fileUnsupported: "Wybierz plik PNG, JPG albo WebP.",
  },
} as const;

export function SettingsPanel({
  copy,
  companyLogoDataUrl,
  isSaving,
  language,
  onBack,
  onChangePassword,
  onSaveLogo,
}: {
  copy: CabinetCopy;
  companyLogoDataUrl: string | null;
  isSaving: boolean;
  language: LanguageCode;
  onBack: () => void;
  onChangePassword: (
    currentPassword: string,
    nextPassword: string,
  ) => Promise<void>;
  onSaveLogo: (logoDataUrl: string | null) => Promise<void>;
}) {
  const settings = settingsCopy[language];
  const [logoMessage, setLogoMessage] = useState("");
  const [logoError, setLogoError] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  async function handleLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    setLogoMessage("");
    setLogoError("");

    if (!file) {
      return;
    }

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setLogoError(settings.fileUnsupported);
      event.target.value = "";
      return;
    }

    if (file.size > 1024 * 1024) {
      setLogoError(settings.fileTooLarge);
      event.target.value = "";
      return;
    }

    const logoDataUrl = await readFileAsDataUrl(file);

    try {
      await onSaveLogo(logoDataUrl);
      setLogoMessage(settings.logoSaved);
    } catch (error) {
      setLogoError(error instanceof Error ? error.message : settings.fileUnsupported);
    } finally {
      event.target.value = "";
    }
  }

  async function handleRemoveLogo() {
    setLogoMessage("");
    setLogoError("");

    try {
      await onSaveLogo(null);
      setLogoMessage(settings.logoSaved);
    } catch (error) {
      setLogoError(error instanceof Error ? error.message : settings.fileUnsupported);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordMessage("");
    setPasswordError("");

    if (password.length < 8) {
      setPasswordError(settings.passwordTooShort);
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError(settings.passwordsMismatch);
      return;
    }

    try {
      await onChangePassword(currentPassword, password);
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
      setPasswordMessage(settings.passwordSaved);
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : settings.passwordsMismatch);
    }
  }

  return (
    <section className="rounded-[2rem] border border-slate-200/70 bg-white/90 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur sm:p-5">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        {copy.backToMenu}
      </button>
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
        {copy.settingsTitle}
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
        {copy.settingsDescription}
      </p>

      <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <LanguageSwitcher />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="text-lg font-semibold text-slate-900">
            {settings.logoTitle}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {settings.logoDescription}
          </p>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
              {companyLogoDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={companyLogoDataUrl}
                  alt=""
                  className="h-full w-full rounded-lg object-contain p-2"
                />
              ) : (
                <span className="text-xs font-semibold text-slate-400">LOGO</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                {settings.uploadLogo}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  disabled={isSaving}
                  onChange={handleLogoChange}
                />
              </label>
              {companyLogoDataUrl ? (
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  disabled={isSaving}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {settings.removeLogo}
                </button>
              ) : null}
            </div>
          </div>

          {logoError ? (
            <p className="mt-3 text-sm text-rose-600">{logoError}</p>
          ) : null}
          {logoMessage ? (
            <p className="mt-3 text-sm text-emerald-700">{logoMessage}</p>
          ) : null}
        </div>

        <form
          className="rounded-lg border border-slate-200 bg-white p-4"
          onSubmit={handlePasswordSubmit}
        >
          <h3 className="text-lg font-semibold text-slate-900">
            {settings.passwordTitle}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {settings.passwordDescription}
          </p>

          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              {settings.currentPassword}
            </span>
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            />
          </label>

          <label className="mt-3 block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              {settings.newPassword}
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            />
          </label>

          <label className="mt-3 block">
            <span className="mb-2 block text-sm font-medium text-slate-700">
              {settings.repeatPassword}
            </span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-base text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            />
          </label>

          {passwordError ? (
            <p className="mt-3 text-sm text-rose-600">{passwordError}</p>
          ) : null}
          {passwordMessage ? (
            <p className="mt-3 text-sm text-emerald-700">{passwordMessage}</p>
          ) : null}

          <button
            type="submit"
            disabled={isSaving}
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {settings.savePassword}
          </button>
        </form>
      </div>
    </section>
  );
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Could not read the selected file."));
    };
    reader.onerror = () => reject(new Error("Could not read the selected file."));
    reader.readAsDataURL(file);
  });
}
