import { Page } from '../components/page/Page';

export default function Impressum() {
  return (
    <Page title="Impressum">
      <h1 id="impressum">Impressum</h1>
      <p>Florian Reisinger Robert-Stolz-Straße 8, 4020 Linz Österreich</p>
      <p>florian@reisinger.pictures</p>
      <p>Weitere Kontaktmöglichkeien am Ende dieser Seite (Kontaktformular, Facebook, usw.)</p>
      <h2 id="haftung-f-r-verweise-auf-andere-webseite">Haftung für Verweise auf andere Webseite</h2>
      <p>
        Diese Webseite kann Links auf andere Webseiten enthalten.
        Dadurch, dass wir keinen Einfluss auf diese Webseiten haben kann laut § 17 ECG keine Verantwortung über den Inhalt dieser gegeben werden.
        Zum Zeitpunkt des Erstellen eines Verweises auf diese Webseite war uns keine Rechtswidrigkeit bekannt.
        Bei Bekanntwerden einer Rechtswiedrigkeit wird der Link entfernt.
      </p>
      <h2 id="urheberrecht">Urheberrecht</h2>
      <p>Das Urheberrecht gilt für alle Inhalte dieser Webseite.</p>
      <h2 id="dsgvo">DsGVo</h2>
      <p>
        Diese Webseite ist mit TLS Verschlüsselt. Das bedeutet, dass für einen dritten der Inhalt der übertragenen Daten nicht feststellbar ist.
        Ihnen stehen grundsätzlich die Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerruf und Widerspruch zu.
        Wenn Sie glauben, dass die Verarbeitung Ihrer Daten gegen das Datenschutzrecht verstößt oder Ihre datenschutzrechtlichen Ansprüche sonst in einer Weise verletzt worden sind,
        können Sie sich bei der Aufsichtsbehörde beschweren. In Österreich ist dies die Datenschutzbehörde.
      </p>
      <h3 id="tracking">Tracking</h3>
      <p>
        Diese Webseite zeichnet das Besucherverhalten auf. Im Gegensatz zu vielen anderen Webseite nutzt diese Webseite das Tool Matomo.
        Matomo ist eine selbst gehostete Alternative zu Google Analytics.
        Die erhobenen Daten werden also mit keiner anderen Person geteilt, auch seitenübergreifendes Tracking ist hiermit nicht möglich.
        Für Analytics zwecke wird Ihnen eine ID zugeordnet, um Sie zu identifizieren. Diese ID ist nur Ihnen bekannt
      </p>
      <p>
        Es werden statistische Informationen über Ihr Gerät, die aufgerufenen Seiten und ähnliche Daten gespeichert.
        Diese Daten nutzen wir um den Webauftritt weiter zu optimieren. Falls Sie eine Auskunft / Löschung wünschen bitte ich Sie mich zu kontaktieren
        Um nicht mehr Daten als nötig zu erheben bitte ich Sie mir den Inhalt des MATOMO_SESSID Cookie mitzuteilen. Eine andere Möglichkeit der Identifikation Ihrer Daten ist technisch nicht möglich.
      </p>
      <h3 id="kontaktformular">Kontaktformular</h3>
      <p>
        Falls Sie das Kontaktformular nutzen werden die von Ihnen eingegebenen Informationen an meine E-Mail Adresse gesandt.
        Eine zusätzliche Speicherung auf meinem Server ist möglich, um zu garantieren, dass Ihre Daten bei einem Übertragungsproblem auch bei mir ankommen bzw.
        falls Sie sich angemeldet haben um Ihnen die zu dieser Sache nötigen Informationen zukommen zu lassen.
      </p>
    </Page>
  );
}
